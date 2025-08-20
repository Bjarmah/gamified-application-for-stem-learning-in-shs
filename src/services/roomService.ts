import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomMember = Database['public']['Tables']['room_members']['Row'];
type RoomQuiz = Database['public']['Tables']['room_quizzes']['Row'];
type RoomQuizAttempt = Database['public']['Tables']['room_quiz_attempts']['Row'];
type RoomMessage = Database['public']['Tables']['room_messages']['Row'];

export interface CreateRoomData {
  name: string;
  description: string;
  subjectId?: string; // Made optional since UI doesn't collect it as a required field
  isPublic: boolean;
  maxMembers: number;
}

export interface CreateQuizData {
  title: string;
  description: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  timeLimit?: number;
  passingScore?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export class RoomService {
  // Create a new room
  static async createRoom(data: CreateRoomData, userId: string): Promise<{ roomId: string; roomCode: string } | null> {
    try {
      console.log('RoomService.createRoom called with:', { data, userId });

      // Generate a simple room code (8 characters)
      const generateRoomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const roomCode = generateRoomCode();
      console.log('Generated room code:', roomCode);

      // First, check if the rooms table exists and has the right structure
      const { data: tableInfo, error: tableError } = await supabase
        .from('rooms')
        .select('*')
        .limit(1);

      if (tableError) {
        console.error('Error checking rooms table:', tableError);
        console.error('Table error details:', {
          code: tableError.code,
          message: tableError.message,
          details: tableError.details,
          hint: tableError.hint
        });
        return null;
      }

      console.log('Rooms table check successful, proceeding with room creation...');

      // Create the room directly
      const roomData = {
        name: data.name,
        description: data.description,
        subject_id: data.subjectId || null,
        is_public: data.isPublic,
        max_members: data.maxMembers,
        room_code: roomCode,
        created_by: userId
      };

      console.log('Attempting to insert room with data:', roomData);

      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert(roomData)
        .select('id, room_code')
        .single();

      if (roomError) {
        console.error('Error creating room:', roomError);
        console.error('Room creation error details:', {
          code: roomError.code,
          message: roomError.message,
          details: roomError.details,
          hint: roomError.hint
        });
        return null;
      }

      console.log('Room created successfully:', room);

      // Add the creator as owner
      const memberData = {
        room_id: room.id,
        user_id: userId,
        role: 'owner'
      };

      console.log('Adding room owner with data:', memberData);

      const { error: memberError } = await supabase
        .from('room_members')
        .insert(memberData);

      if (memberError) {
        console.error('Error adding room owner:', memberError);
        console.error('Member creation error details:', {
          code: memberError.code,
          message: memberError.message,
          details: memberError.details,
          hint: memberError.hint
        });
        // Try to delete the room if adding owner fails
        await supabase.from('rooms').delete().eq('id', room.id);
        return null;
      }

      console.log('Room owner added successfully');

      return {
        roomId: room.id,
        roomCode: room.room_code || roomCode
      };
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  }

  // Join a room by code
  static async joinRoomByCode(roomCode: string, userId: string): Promise<boolean> {
    try {
      // Find the room by code
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('id, max_members, is_public')
        .eq('room_code', roomCode.toUpperCase())
        .eq('is_public', true)
        .single();

      if (roomError || !room) {
        console.error('Room not found or not public:', roomError);
        return false;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('room_members')
        .select('id')
        .eq('room_id', room.id)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        console.log('User already a member of this room');
        return false;
      }

      // Check if room is full
      const { count: memberCount } = await supabase
        .from('room_members')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', room.id);

      if (memberCount && memberCount >= (room.max_members || 50)) {
        console.error('Room is full');
        return false;
      }

      // Add user to room
      const { error: joinError } = await supabase
        .from('room_members')
        .insert({
          room_id: room.id,
          user_id: userId,
          role: 'member'
        });

      if (joinError) {
        console.error('Error joining room:', joinError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  }

  // Get user's rooms
  static async getUserRooms(userId: string): Promise<Room[]> {
    try {
      console.log('Fetching user rooms for user:', userId);
      const startTime = performance.now();

      const { data, error } = await supabase
        .from('room_members')
        .select(`
          room_id,
          rooms (
            id,
            name,
            description,
            room_code,
            max_members,
            is_public,
            subject_id,
            created_at,
            updated_at,
            created_by
          )
        `)
        .eq('user_id', userId);

      const endTime = performance.now();
      console.log(`User rooms query took ${endTime - startTime} ms`);

      if (error) {
        console.error('Error getting user rooms:', error);
        return [];
      }

      const rooms = data?.map(item => item.rooms as Room).filter(Boolean) || [];
      console.log('Found', rooms.length, 'user rooms');
      return rooms;
    } catch (error) {
      console.error('Error getting user rooms:', error);
      return [];
    }
  }

  // Get discoverable rooms (public rooms user is not a member of)
  static async getDiscoverableRooms(userId: string): Promise<Room[]> {
    try {
      console.log('Fetching discoverable rooms for user:', userId);
      const startTime = performance.now();

      // Use a single efficient query with NOT EXISTS to get public rooms user isn't a member of
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_public', true)
        .not('id', 'in', `(
          SELECT room_id FROM room_members WHERE user_id = '${userId}'
        )`);

      const endTime = performance.now();
      console.log(`Discoverable rooms query took ${endTime - startTime} ms`);

      if (error) {
        console.error('Error getting discoverable rooms:', error);
        return [];
      }

      console.log('Found', data?.length || 0, 'discoverable rooms');
      return data || [];
    } catch (error) {
      console.error('Error getting discoverable rooms:', error);
      return [];
    }
  }

  // Get room details with members and quizzes
  static async getRoomDetails(roomId: string): Promise<{
    room: Room | null;
    members: RoomMember[];
    quizzes: RoomQuiz[];
    messages: RoomMessage[];
  }> {
    try {
      // Get room details
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) {
        console.error('Error getting room:', roomError);
        return { room: null, members: [], quizzes: [], messages: [] };
      }

      // Get room members
      const { data: members, error: membersError } = await supabase
        .from('room_members')
        .select('*')
        .eq('room_id', roomId);

      if (membersError) {
        console.error('Error getting room members:', membersError);
        return { room, members: [], quizzes: [], messages: [] };
      }

      // Get room quizzes
      const { data: quizzes, error: quizzesError } = await supabase
        .from('room_quizzes')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_active', true);

      if (quizzesError) {
        console.error('Error getting room quizzes:', quizzesError);
        return { room, members: members || [], quizzes: [], messages: [] };
      }

      // Get room messages (last 50 messages)
      const { data: messages, error: messagesError } = await supabase
        .from('room_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (messagesError) {
        console.error('Error getting room messages:', messagesError);
        return { room, members: members || [], quizzes: quizzes || [], messages: [] };
      }

      return {
        room,
        members: members || [],
        quizzes: quizzes || [],
        messages: (messages || []).reverse() // Reverse to show oldest first
      };
    } catch (error) {
      console.error('Error getting room details:', error);
      return { room: null, members: [], quizzes: [], messages: [] };
    }
  }

  // Create a quiz in a room
  static async createQuiz(roomId: string, quizData: CreateQuizData, userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('room_quizzes')
        .insert({
          room_id: roomId,
          title: quizData.title,
          description: quizData.description,
          questions: quizData.questions,
          time_limit: quizData.timeLimit,
          passing_score: quizData.passingScore || 70,
          created_by: userId
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating quiz:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error creating quiz:', error);
      return null;
    }
  }

  // Submit quiz attempt
  static async submitQuizAttempt(
    quizId: string,
    userId: string,
    score: number,
    totalQuestions: number,
    percentage: number,
    answers: number[]
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('room_quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: userId,
          score,
          total_questions: totalQuestions,
          percentage,
          answers
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error submitting quiz attempt:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      return null;
    }
  }

  // Send a message to a room
  static async sendMessage(roomId: string, userId: string, content: string, messageType: 'message' | 'system' = 'message'): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('room_messages')
        .insert({
          room_id: roomId,
          user_id: userId,
          content,
          message_type: messageType
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Leave a room
  static async leaveRoom(roomId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('room_members')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error leaving room:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error leaving room:', error);
      return false;
    }
  }

  // Delete a room (only for room owners)
  static async deleteRoom(roomId: string, userId: string): Promise<boolean> {
    try {
      // Check if user is room owner
      const { data: member, error: memberError } = await supabase
        .from('room_members')
        .select('role')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .single();

      if (memberError || member?.role !== 'owner') {
        console.error('User is not room owner');
        return false;
      }

      // Delete the room (cascade will handle related records)
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) {
        console.error('Error deleting room:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting room:', error);
      return false;
    }
  }

  // Get quiz attempts for a user
  static async getUserQuizAttempts(userId: string): Promise<RoomQuizAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('room_quiz_attempts')
        .select(`
          *,
          room_quizzes (
            title,
            description
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error getting quiz attempts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting quiz attempts:', error);
      return [];
    }
  }
}

