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
  subjectId: string;
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
      const { data: result, error } = await (supabase as any).rpc('create_room_with_owner', {
        room_name: data.name,
        room_description: data.description,
        room_subject_id: data.subjectId,
        room_is_public: data.isPublic,
        room_max_members: data.maxMembers,
        owner_user_id: userId
      });

      if (error) {
        console.error('Error creating room:', error);
        return null;
      }

      // Get the room code for the newly created room
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('room_code')
        .eq('id', result)
        .single();

      if (roomError || !roomData) {
        console.error('Error getting room code:', roomError);
        return null;
      }

      return {
        roomId: result as string,
        roomCode: roomData.room_code as string || ''
      };
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  }

  // Join a room by code
  static async joinRoomByCode(roomCode: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await (supabase as any).rpc('join_room_by_code', {
        room_code_input: roomCode.toUpperCase(),
        user_id_input: userId
      });

      if (error) {
        console.error('Error joining room:', error);
        return false;
      }

      return data as boolean;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  }

  // Get user's rooms
  static async getUserRooms(userId: string): Promise<Room[]> {
    try {
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

      if (error) {
        console.error('Error getting user rooms:', error);
        return [];
      }

      return data.map(item => item.rooms as Room);
    } catch (error) {
      console.error('Error getting user rooms:', error);
      return [];
    }
  }

  // Get discoverable rooms (public rooms user is not a member of)
  static async getDiscoverableRooms(userId: string): Promise<Room[]> {
    try {
      // Get all public rooms
      const { data: publicRooms, error: publicError } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_public', true);

      if (publicError) {
        console.error('Error getting public rooms:', publicError);
        return [];
      }

      // Get rooms user is already a member of
      const { data: memberRooms, error: memberError } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', userId);

      if (memberError) {
        console.error('Error getting member rooms:', memberError);
        return [];
      }

      const memberRoomIds = new Set(memberRooms.map(mr => mr.room_id));

      // Filter out rooms user is already a member of
      return publicRooms.filter(room => !memberRoomIds.has(room.id));
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

