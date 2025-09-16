import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Users,
    Hash,
    Copy,
    Send,
    MoreVertical,
    Settings,
    LogOut,
    MessageSquare,
    Plus,
    FileText,
    Trophy,
    CheckCircle,
    XCircle,
    BarChart3,
    Clock,
    Trash2,
    Circle,
    Sparkles,
    BookOpen
} from 'lucide-react';
import ImageUpload from '@/components/chat/ImageUpload';
import { useRoomRealtime } from '@/hooks/use-room-realtime';
import { useTypingIndicator } from '@/hooks/use-typing-indicator';
import { useQuizRealtime } from '@/hooks/use-quiz-realtime';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useGamificationRewards } from '@/hooks/use-gamification-rewards';
import { useQuizContext } from '@/context/QuizContext';
import { RoomService, CreateQuizData } from '@/services/roomService';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { FloatingAIChatbot } from '@/components/ai-chatbot';
import RoomQuizCreator from '@/components/quiz/RoomQuizCreator';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomMember = Database['public']['Tables']['room_members']['Row'] & { profile?: { full_name?: string } };
type RoomQuiz = Database['public']['Tables']['room_quizzes']['Row'];
type RoomQuizAttempt = Database['public']['Tables']['room_quiz_attempts']['Row'];
type RoomMessage = Database['public']['Tables']['room_messages']['Row'] & { profile?: { full_name?: string } };

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

const RoomDetail = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const { rewardQuizCompletion, rewardRoomJoin, rewardMessageSent } = useGamificationRewards();
    const { setIsQuizActive, setQuizTitle } = useQuizContext();
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState<Room | null>(null);
    const [members, setMembers] = useState<RoomMember[]>([]);
    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const [activeTab, setActiveTab] = useState('chat');
    const [loading, setLoading] = useState(true);
    
    // Real-time features
    const { 
        messages: realtimeMessages, 
        setMessages: setRealtimeMessages, 
        onlineUsers, 
        typingUsers, 
        broadcastTyping 
    } = useRoomRealtime(roomId || '');
    
    const { handleTyping, stopTyping } = useTypingIndicator(broadcastTyping);
    
    // Real-time quiz features
    const { liveAttempts, leaderboard, setLiveAttempts } = useQuizRealtime(roomId || '');

    // Quiz states
    const [quizzes, setQuizzes] = useState<RoomQuiz[]>([]);
    const [quizAttempts, setQuizAttempts] = useState<RoomQuizAttempt[]>([]);
    const [allQuizAttempts, setAllQuizAttempts] = useState<(RoomQuizAttempt & { profile?: { full_name?: string } })[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<RoomQuiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
    const [showQuizResults, setShowQuizResults] = useState(false);

    // Quiz creation states
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);

    // Room quiz creation with new component
    const handleRoomQuizCreate = async (roomQuiz: any) => {
        if (!roomId || !user) return;

        try {
            // Convert room quiz format to backend format (add random correct answers for storage)
            const questionsWithAnswers = roomQuiz.questions.map((q: any) => ({
                question: q.question,
                options: q.options,
                correctAnswer: Math.floor(Math.random() * 4) // Random correct answer since creator doesn't know
            }));

            const quizData: CreateQuizData = {
                title: roomQuiz.title,
                description: roomQuiz.description,
                questions: questionsWithAnswers,
                timeLimit: roomQuiz.timeLimit,
                passingScore: roomQuiz.passingScore
            };

            const quizId = await RoomService.createQuiz(roomId, quizData, user.id);
            if (quizId) {
                const newQuizItem: RoomQuiz = {
                    id: quizId,
                    room_id: roomId,
                    title: quizData.title,
                    description: quizData.description,
                    questions: quizData.questions,
                    time_limit: quizData.timeLimit,
                    passing_score: quizData.passingScore,
                    is_active: true,
                    created_by: user.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                setQuizzes([...quizzes, newQuizItem]);
                setShowCreateQuiz(false);

                toast({
                    title: "Quiz Created! ✨",
                    description: `${roomQuiz.title} has been created successfully.`
                });
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            toast({
                title: "Error",
                description: "Failed to create quiz. Please try again.",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        if (roomId && user) {
            loadRoomDetails();
            setupPresence();
        }

        return () => {
            // Mark user as offline when leaving
            if (roomId && user) {
                RoomService.updateOnlineStatus(roomId, user.id, false);
            }
        };
    }, [roomId, user]);

    const setupPresence = async () => {
        if (!roomId || !user) return;

        // Mark user as online
        await RoomService.updateOnlineStatus(roomId, user.id, true);

        // Set up realtime subscription for member updates
        const channel = supabase
            .channel(`room_${roomId}_presence`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'room_members',
                    filter: `room_id=eq.${roomId}`
                },
                () => {
                    loadRoomDetails();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const loadRoomDetails = async () => {
        if (!roomId || !user) return;

        setLoading(true);
        try {
            const details = await RoomService.getRoomDetails(roomId);
            setRoom(details.room);
            setMembers(details.members);
            setQuizzes(details.quizzes);
            setMessages(details.messages);
            setRealtimeMessages(details.messages);

            // Load user's quiz attempts for this room
            const attempts = await RoomService.getUserQuizAttempts(user.id);
            const roomAttempts = attempts.filter(attempt =>
                details.quizzes.some(quiz => quiz.id === attempt.quiz_id)
            );
            setQuizAttempts(roomAttempts);

            // Load all quiz attempts for shared results
            const allAttempts = await RoomService.getRoomQuizAttempts(roomId);
            setAllQuizAttempts(allAttempts);
            setLiveAttempts(allAttempts);
        } catch (error) {
            console.error('Error loading room details:', error);
            toast({
                title: "Error",
                description: "Failed to load room details. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (imageUrl?: string) => {
        if ((!message.trim() && !imageUrl) || !roomId || !user) return;

        try {
            const messageId = await RoomService.sendMessage(roomId, user.id, message.trim() || '', 'message', imageUrl);
            if (messageId) {
                // Add message to local state
                const newMessage: RoomMessage = {
                    id: messageId,
                    room_id: roomId,
                    user_id: user.id,
                    content: message.trim() || '',
                    message_type: 'message',
                    image_url: imageUrl || null,
                    created_at: new Date().toISOString()
                };
                // Don't update local state here - realtime will handle it
                setMessage('');
                stopTyping(); // Stop typing when message is sent
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleImageUpload = (imageUrl: string) => {
        handleSendMessage(imageUrl);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (e.target.value.trim()) {
            handleTyping();
        } else {
            stopTyping();
        }
    };

    const copyRoomCode = () => {
        if (room?.room_code) {
            navigator.clipboard.writeText(room.room_code);
            toast({
                title: "Code Copied",
                description: "Room code copied to clipboard."
            });
        }
    };

    const handleLeaveRoom = async () => {
        if (!roomId || !user) return;

        try {
            const success = await RoomService.leaveRoom(roomId, user.id);
            if (success) {
                toast({
                    title: "Left Room",
                    description: "You have left the room."
                });
                navigate('/rooms');
            } else {
                toast({
                    title: "Error",
                    description: "Failed to leave room. Please try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error leaving room:', error);
            toast({
                title: "Error",
                description: "Failed to leave room. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteRoom = async () => {
        if (!roomId || !user) return;

        try {
            const success = await RoomService.deleteRoom(roomId, user.id);
            if (success) {
                toast({
                    title: "Room Deleted",
                    description: "Room has been deleted successfully."
                });
                navigate('/rooms');
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete room. You may not have permission.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            toast({
                title: "Error",
                description: "Failed to delete room. Please try again.",
                variant: "destructive"
            });
        }
    };

    // Quiz functions
    const startQuiz = (quiz: RoomQuiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        const questions = quiz.questions as unknown as QuizQuestion[];
        setUserAnswers(new Array(questions.length).fill(-1));
        setQuizStartTime(new Date());
        setShowQuizResults(false);
        setActiveTab('quiz');

        // Activate quiz mode
        setIsQuizActive(true);
        setQuizTitle(quiz.title);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answerIndex;
        setUserAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (!currentQuiz) return;
        const questions = currentQuiz.questions as unknown as QuizQuestion[];
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const finishQuiz = async () => {
        if (!currentQuiz || !user) return;

        const questions = currentQuiz.questions as unknown as QuizQuestion[];
        
        // Calculate score for AI-generated questions (which have _correctAnswer)
        let score = 0;
        let gradedQuestions = 0;
        
        userAnswers.forEach((answer, index) => {
            const question = questions[index] as any;
            // Check if this is an AI-generated question with auto-grading capability
            if (question._correctAnswer !== undefined) {
                gradedQuestions++;
                if (answer === question._correctAnswer) {
                    score++;
                }
            } else if (question.correctAnswer !== undefined) {
                // Fallback for legacy format
                gradedQuestions++;
                if (answer === question.correctAnswer) {
                    score++;
                }
            }
        });

        // Only calculate percentage if we have gradable questions
        const percentage = gradedQuestions > 0 ? Math.round((score / gradedQuestions) * 100) : 0;
        const timeSpent = quizStartTime ? Math.floor((Date.now() - quizStartTime.getTime()) / 1000) : 0;

        try {
            const attemptId = await RoomService.submitQuizAttempt(
                currentQuiz.id,
                user.id,
                score,
                gradedQuestions, // Use graded questions count instead of total
                percentage,
                userAnswers
            );

            if (attemptId) {
                const newAttempt: RoomQuizAttempt = {
                    id: attemptId,
                    quiz_id: currentQuiz.id,
                    user_id: user.id,
                    score,
                    total_questions: gradedQuestions,
                    percentage,
                    answers: userAnswers,
                    completed_at: new Date().toISOString()
                };

                setQuizAttempts([...quizAttempts, newAttempt]);
                setAllQuizAttempts([...allQuizAttempts, { ...newAttempt, profile: user.email ? { full_name: user.email } : undefined }]);
                setShowQuizResults(true);

                // Only reward if we have auto-gradable questions
                if (gradedQuestions > 0) {
                    await rewardQuizCompletion(currentQuiz.id, percentage, timeSpent);
                }

                // Deactivate quiz mode
                setIsQuizActive(false);
                setQuizTitle(undefined);
            }
        } catch (error) {
            console.error('Error submitting quiz attempt:', error);
            toast({
                title: "Error",
                description: "Failed to submit quiz. Please try again.",
                variant: "destructive"
            });
        }
    };

    const isRoomOwner = members.find(m => m.user_id === user?.id)?.role === 'owner';

    if (loading) {
        return <div className="max-w-7xl mx-auto pb-8">Loading...</div>;
    }

    if (!room || !user) {
        return <div className="max-w-7xl mx-auto pb-8">Room not found or access denied.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/rooms')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Rooms
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{room.name}</h1>
                        <p className="text-muted-foreground">{room.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="bg-stemPurple/20 text-stemPurple border-stemPurple/30">
                        {room.subject_id || 'General'}
                    </Badge>
                    <Button variant="outline" onClick={copyRoomCode}>
                        <Hash className="h-4 w-4 mr-2" />
                        {room.room_code}
                        <Copy className="h-4 w-4 ml-2" />
                    </Button>
                    {isRoomOwner && (
                        <Button variant="outline" onClick={handleDeleteRoom} className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Room
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleLeaveRoom}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Leave Room
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="quizzes">Quizzes ({quizzes.length})</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent value="chat" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chat Area */}
                        <div className="lg:col-span-3">
                            <Card className="h-[600px] flex flex-col">
                                <CardHeader className="border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Chat
                                        <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                {onlineUsers.length} online
                                            </div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col p-0">
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {realtimeMessages.map((msg) => (
                                            <div key={msg.id} className={`flex gap-3 ${msg.message_type === 'system' ? 'justify-center' : ''}`}>
                                                {msg.message_type === 'system' ? (
                                                    <div className="text-center">
                                                        <Badge variant="outline" className="text-xs">
                                                            {msg.content}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>
                                                                {msg.user_id === user.id
                                                                    ? 'Y'
                                                                    : (msg.profile?.full_name?.charAt(0) || 'U')
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                             <div className="flex items-center gap-2 mb-1">
                                                                 <span className="font-medium text-sm">
                                                                     {msg.user_id === user.id
                                                                         ? 'You'
                                                                         : (msg.profile?.full_name || 'Unknown User')
                                                                     }
                                                                 </span>
                                                                 <span className="text-xs text-muted-foreground">
                                                                     {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                                                                 </span>
                                                             </div>
                                                             {msg.content && <p className="text-sm mb-2">{msg.content}</p>}
                                                             {msg.image_url && (
                                                                 <div className="mt-2">
                                                                     <img 
                                                                         src={msg.image_url} 
                                                                         alt="Shared image"
                                                                         className="max-w-sm max-h-64 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                                                         onClick={() => window.open(msg.image_url, '_blank')}
                                                                     />
                                                                 </div>
                                                             )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        
                                        {/* Typing Indicators */}
                                        {typingUsers.length > 0 && (
                                            <div className="flex gap-3 items-center text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                    </div>
                                                    <span>
                                                        {typingUsers.length === 1 
                                                            ? `${typingUsers[0].full_name} is typing...`
                                                            : `${typingUsers.length} people are typing...`
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                     {/* Message Input */}
                                     <div className="border-t p-4">
                                         <div className="flex gap-2">
                                             <ImageUpload
                                                 onImageUpload={handleImageUpload}
                                                 disabled={loading}
                                             />
                                             <Input
                                                 placeholder="Type your message..."
                                                 value={message}
                                                 onChange={handleInputChange}
                                                 onKeyPress={(e) => {
                                                     if (e.key === 'Enter') {
                                                         handleSendMessage();
                                                     }
                                                 }}
                                                 className="flex-1"
                                             />
                                             <Button onClick={() => handleSendMessage()}>
                                                 <Send className="h-4 w-4" />
                                             </Button>
                                         </div>
                                     </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Online Members */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Members ({members.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {members.map((member) => {
                                        const isOnline = onlineUsers.some(u => u.user_id === member.user_id) || member.user_id === user?.id;
                                        return (
                                            <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                                <Avatar className="h-8 w-8 relative">
                                                    <AvatarFallback>
                                                        {member.profile?.full_name?.[0]?.toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                    {isOnline && (
                                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                                                    )}
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {member.user_id === user?.id ? 'You' : (member.profile?.full_name || 'Unknown User')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {member.role === 'owner' ? 'Owner' : 'Member'}
                                                        {isOnline && ' • Online'}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={isOnline ? 'default' : 'secondary'}
                                                    className={isOnline ? 'bg-green-500' : ''}
                                                >
                                                    {isOnline ? 'Online' : 'Offline'}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="mt-6">
                    <div className="grid gap-4">
                        {quizzes.map((quiz) => {
                            const questions = quiz.questions as unknown as QuizQuestion[];
                            return (
                                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-semibold">{quiz.title}</h3>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />
                                                        {questions.length} questions
                                                    </Badge>
                                                    {quiz.time_limit && (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {quiz.time_limit} min
                                                        </Badge>
                                                    )}
                                                    
                                                    {/* Auto-grading indicator */}
                                                    {(() => {
                                                        const gradedQuestions = questions.filter((q: any) => 
                                                            q._correctAnswer !== undefined || q.correctAnswer !== undefined
                                                        ).length;
                                                        
                                                        if (gradedQuestions > 0) {
                                                            return (
                                                                <Badge variant="secondary" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800">
                                                                    <Sparkles className="h-3 w-3" />
                                                                    {gradedQuestions === questions.length ? 'Auto-graded' : `${gradedQuestions}/${questions.length} graded`}
                                                                </Badge>
                                                            );
                                                        } else {
                                                            return (
                                                                <Badge variant="outline" className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                                    <BookOpen className="h-3 w-3" />
                                                                    Practice only
                                                                </Badge>
                                                            );
                                                        }
                                                    })()}
                                                </div>

                                                <p className="text-muted-foreground mb-3">{quiz.description}</p>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Trophy className="h-4 w-4" />
                                                        {quizAttempts.filter(a => a.quiz_id === quiz.id).length} attempts
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        Created {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button
                                                    size="sm"
                                                    onClick={() => startQuiz(quiz)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    Take Quiz
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {quizzes.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No quizzes available.</p>
                                <p className="text-sm">Room owners can create quizzes to test knowledge.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="mt-6">
                    <div className="grid gap-6">
                        {/* Live Leaderboard */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5" />
                                    Live Leaderboard
                                    <Badge variant="outline" className="animate-pulse">LIVE</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {leaderboard.length > 0 ? (
                                    <div className="space-y-3">
                                        {leaderboard.map((user, index) => (
                                            <div key={user.user_id} className="flex items-center gap-3 p-3 rounded-lg border">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    index === 0 ? 'bg-yellow-500 text-white' :
                                                    index === 1 ? 'bg-gray-400 text-white' :
                                                    index === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-muted text-muted-foreground'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="font-medium">{user.full_name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.attempts_count} quiz{user.attempts_count !== 1 ? 'es' : ''} completed
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-primary">
                                                        {Math.round(user.avg_percentage)}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Average Score
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No scores yet!</p>
                                        <p className="text-sm">Complete quizzes to appear on the leaderboard.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        {/* Detailed Results */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-4">
                                    <CardTitle>All Quiz Results</CardTitle>
                                    <Badge variant="outline">{liveAttempts.length} attempts</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {liveAttempts.map((attempt) => {
                                        const quiz = quizzes.find(q => q.id === attempt.quiz_id);
                                        const isCurrentUser = attempt.user_id === user?.id;
                                        return (
                                            <Card key={attempt.id} className={`hover:shadow-md transition-shadow ${isCurrentUser ? 'ring-2 ring-stemPurple/20' : ''}`}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-12 w-12">
                                                                <AvatarFallback className={isCurrentUser ? 'bg-stemPurple/20 text-stemPurple' : ''}>
                                                                    {isCurrentUser
                                                                        ? 'Y'
                                                                        : (attempt.profile?.full_name?.charAt(0) || 'U')
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-semibold flex items-center gap-2">
                                                                    {isCurrentUser ? 'You' : (attempt.profile?.full_name || 'Unknown User')}
                                                                    {isCurrentUser && <Badge variant="outline" className="text-xs">Me</Badge>}
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {quiz?.title || 'Unknown Quiz'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className={`text-2xl font-bold ${attempt.percentage >= (quiz?.passing_score || 70)
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                                }`}>
                                                                {attempt.percentage}%
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {attempt.score}/{attempt.total_questions} correct
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString() : 'Unknown'}
                                                            </div>
                                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                                {attempt.percentage >= (quiz?.passing_score || 70) ? (
                                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                                )}
                                                                <span className="text-xs">
                                                                    {attempt.percentage >= (quiz?.passing_score || 70) ? 'Passed' : 'Failed'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}

                                    {liveAttempts.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No quiz results yet.</p>
                                            <p className="text-sm">Members need to take quizzes to see results here.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Members Tab */}
                <TabsContent value="members" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Members ({members.length}/{room.max_members || 50})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {members.map((member) => {
                                    const isOnline = onlineUsers.some(u => u.user_id === member.user_id) || member.user_id === user?.id;
                                    return (
                                        <div key={member.id} className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 relative">
                                                <AvatarFallback>
                                                    {member.user_id === user.id
                                                        ? 'Y'
                                                        : (member.profile?.full_name?.charAt(0) || 'U')
                                                    }
                                                </AvatarFallback>
                                                {isOnline && (
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                                                )}
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm truncate">
                                                        {member.user_id === user.id
                                                            ? 'You'
                                                            : (member.profile?.full_name || 'Unknown User')
                                                        }
                                                    </span>
                                                    {member.role === 'owner' && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Owner
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Circle className={`w-2 h-2 fill-current ${isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                                                    <span className="text-xs text-muted-foreground">
                                                        {isOnline ? 'Online' : 'Offline'}
                                                        {!isOnline && member.last_seen && (
                                                            <span className="ml-1">
                                                                · Last seen {new Date(member.last_seen).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quiz Taking Interface */}
                {currentQuiz && activeTab === 'quiz' && (
                    <div className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{currentQuiz.title}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            Question {currentQuestionIndex + 1} of {(currentQuiz.questions as unknown as QuizQuestion[]).length}
                                        </Badge>
                                        {quizStartTime && currentQuiz.time_limit && (
                                            <Badge variant="outline">
                                                Time: {Math.max(0, currentQuiz.time_limit - Math.floor((Date.now() - quizStartTime.getTime()) / 60000))} min
                                            </Badge>
                                        )}
                                    </div>
                                </CardTitle>
                                <CardDescription>{currentQuiz.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {!showQuizResults ? (
                                    <>
                                        <div>
                                            <h3 className="text-lg font-medium mb-4">
                                                {(currentQuiz.questions as unknown as QuizQuestion[])[currentQuestionIndex].question}
                                            </h3>

                                            <RadioGroup
                                                value={userAnswers[currentQuestionIndex] >= 0 ? userAnswers[currentQuestionIndex].toString() : ''}
                                                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                                            >
                                                <div className="space-y-3">
                                                    {(currentQuiz.questions as unknown as QuizQuestion[])[currentQuestionIndex].options.map((option, index) => (
                                                        <div key={index} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                                            <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                                                                {option}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button
                                                variant="outline"
                                                onClick={previousQuestion}
                                                disabled={currentQuestionIndex === 0}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                onClick={nextQuestion}
                                                disabled={userAnswers[currentQuestionIndex] === -1}
                                            >
                                                {currentQuestionIndex === (currentQuiz.questions as unknown as QuizQuestion[]).length - 1 ? 'Finish Quiz' : 'Next'}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl">
                                            {quizAttempts[quizAttempts.length - 1]?.percentage >= 70 ? '🎉' : '📚'}
                                        </div>
                                        <h3 className="text-2xl font-bold">
                                            Quiz Complete!
                                        </h3>
                                        
                                        {/* Check if quiz was auto-graded */}
                                        {(() => {
                                            const questions = currentQuiz.questions as unknown as QuizQuestion[];
                                            const gradedQuestions = questions.filter((q: any) => 
                                                q._correctAnswer !== undefined || q.correctAnswer !== undefined
                                            ).length;
                                            const totalQuestions = questions.length;
                                            
                                            if (gradedQuestions > 0) {
                                                return (
                                                    <>
                                                        <p className="text-lg">
                                                            You scored {quizAttempts[quizAttempts.length - 1]?.score} out of {gradedQuestions} auto-graded questions
                                                        </p>
                                                        <p className="text-2xl font-bold text-stemPurple">
                                                            {quizAttempts[quizAttempts.length - 1]?.percentage}%
                                                        </p>
                                                        {gradedQuestions < totalQuestions && (
                                                            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                                    ✨ {gradedQuestions} AI-generated questions were auto-graded. 
                                                                    {totalQuestions - gradedQuestions} manual questions were for practice only.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            } else {
                                                return (
                                                    <>
                                                        <p className="text-lg">
                                                            Practice completed! {totalQuestions} questions answered.
                                                        </p>
                                                        <div className="bg-gray-50 dark:bg-gray-950/30 p-3 rounded-lg">
                                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                                📚 This quiz contains manually created questions and cannot be auto-graded. 
                                                                Great practice though!
                                                            </p>
                                                        </div>
                                                    </>
                                                );
                                            }
                                        })()}
                                        
                                        <div className="flex gap-2 justify-center">
                                            <Button onClick={() => setActiveTab('results')}>
                                                View All Results
                                            </Button>
                                            <Button variant="outline" onClick={() => {
                                                setCurrentQuiz(null);
                                                setIsQuizActive(false);
                                                setQuizTitle(undefined);
                                            }}>
                                                Back to Room
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Tabs>

            {/* AI Learning Assistant */}
            <FloatingAIChatbot position="bottom-right" />
        </div>
  );
};

export default RoomDetail;
