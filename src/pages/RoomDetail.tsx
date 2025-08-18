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
    Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { RoomService, CreateQuizData } from '@/services/roomService';
import { Database } from '@/integrations/supabase/types';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomMember = Database['public']['Tables']['room_members']['Row'];
type RoomQuiz = Database['public']['Tables']['room_quizzes']['Row'];
type RoomQuizAttempt = Database['public']['Tables']['room_quiz_attempts']['Row'];
type RoomMessage = Database['public']['Tables']['room_messages']['Row'];

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
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState<Room | null>(null);
    const [members, setMembers] = useState<RoomMember[]>([]);
    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const [activeTab, setActiveTab] = useState('chat');
    const [loading, setLoading] = useState(true);

    // Quiz states
    const [quizzes, setQuizzes] = useState<RoomQuiz[]>([]);
    const [quizAttempts, setQuizAttempts] = useState<RoomQuizAttempt[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<RoomQuiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
    const [showQuizResults, setShowQuizResults] = useState(false);

    // Quiz creation states
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        description: '',
        timeLimit: 15,
        passingScore: 70
    });
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

    useEffect(() => {
        if (roomId && user) {
            loadRoomDetails();
        }
    }, [roomId, user]);

    const loadRoomDetails = async () => {
        if (!roomId || !user) return;

        setLoading(true);
        try {
            const details = await RoomService.getRoomDetails(roomId);
            setRoom(details.room);
            setMembers(details.members);
            setQuizzes(details.quizzes);
            setMessages(details.messages);

            // Load user's quiz attempts for this room
            const attempts = await RoomService.getUserQuizAttempts(user.id);
            const roomAttempts = attempts.filter(attempt => 
                quizzes.some(quiz => quiz.id === attempt.quiz_id)
            );
            setQuizAttempts(roomAttempts);
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

    const handleSendMessage = async () => {
        if (!message.trim() || !roomId || !user) return;

        try {
            const messageId = await RoomService.sendMessage(roomId, user.id, message.trim());
            if (messageId) {
                // Add message to local state
                const newMessage: RoomMessage = {
                    id: messageId,
                    room_id: roomId,
                    user_id: user.id,
                    content: message.trim(),
                    message_type: 'message',
                    created_at: new Date().toISOString()
                };
                setMessages([...messages, newMessage]);
                setMessage('');
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
        const questions = quiz.questions as QuizQuestion[];
        setUserAnswers(new Array(questions.length).fill(-1));
        setQuizStartTime(new Date());
        setShowQuizResults(false);
        setActiveTab('quiz');
    };

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answerIndex;
        setUserAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (!currentQuiz) return;
        const questions = currentQuiz.questions as QuizQuestion[];
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

        const questions = currentQuiz.questions as QuizQuestion[];
        const score = userAnswers.reduce((acc, answer, index) => {
            return acc + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);

        const percentage = Math.round((score / questions.length) * 100);

        try {
            const attemptId = await RoomService.submitQuizAttempt(
                currentQuiz.id,
                user.id,
                score,
                questions.length,
                percentage,
                userAnswers
            );

            if (attemptId) {
                const newAttempt: RoomQuizAttempt = {
                    id: attemptId,
                    quiz_id: currentQuiz.id,
                    user_id: user.id,
                    score,
                    total_questions: questions.length,
                    percentage,
                    answers: userAnswers,
                    completed_at: new Date().toISOString()
                };

                setQuizAttempts([...quizAttempts, newAttempt]);
                setShowQuizResults(true);
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

    const createQuiz = async () => {
        if (!roomId || !user || !newQuiz.title.trim() || !newQuiz.description.trim() || quizQuestions.length === 0) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields and add at least one question.",
                variant: "destructive"
            });
            return;
        }

        try {
            const quizData: CreateQuizData = {
                title: newQuiz.title.trim(),
                description: newQuiz.description.trim(),
                questions: quizQuestions,
                timeLimit: newQuiz.timeLimit,
                passingScore: newQuiz.passingScore
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
                setNewQuiz({ title: '', description: '', timeLimit: 15, passingScore: 70 });
                setQuizQuestions([]);
                setShowCreateQuiz(false);

                toast({
                    title: "Quiz Created",
                    description: `${newQuiz.title} has been created successfully.`
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

    const addQuestion = () => {
        setQuizQuestions([...quizQuestions, {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
        }]);
    };

    const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
        const newQuestions = [...quizQuestions];
        if (field === 'options') {
            newQuestions[index].options = value;
        } else {
            (newQuestions[index] as any)[field] = value;
        }
        setQuizQuestions(newQuestions);
    };

    const removeQuestion = (index: number) => {
        setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
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
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col p-0">
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((msg) => (
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
                                                            <AvatarFallback>{msg.user_id === user.id ? 'You' : 'U'}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-sm">
                                                                    {msg.user_id === user.id ? 'You' : 'User'}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm">{msg.content}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="border-t p-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Type your message..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                className="flex-1"
                                            />
                                            <Button onClick={handleSendMessage}>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions Sidebar */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {quizzes.map((quiz) => (
                                        <Button
                                            key={quiz.id}
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => startQuiz(quiz)}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            {quiz.title}
                                        </Button>
                                    ))}
                                    {isRoomOwner && (
                                        <Dialog open={showCreateQuiz} onOpenChange={setShowCreateQuiz}>
                                            <DialogTrigger asChild>
                                                <Button className="w-full">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Create Quiz
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Create New Quiz</DialogTitle>
                                                    <DialogDescription>
                                                        Create a quiz for room members to test their knowledge.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="quiz-title">Quiz Title</Label>
                                                        <Input
                                                            id="quiz-title"
                                                            value={newQuiz.title}
                                                            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                                            placeholder="E.g., Newton's Laws Quiz"
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="quiz-description">Description</Label>
                                                        <Textarea
                                                            id="quiz-description"
                                                            value={newQuiz.description}
                                                            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                                                            placeholder="Describe what this quiz covers"
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="quiz-time">Time Limit (minutes)</Label>
                                                        <Input
                                                            id="quiz-time"
                                                            type="number"
                                                            value={newQuiz.timeLimit}
                                                            onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) })}
                                                            min="1"
                                                            max="60"
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="quiz-passing">Passing Score (%)</Label>
                                                        <Input
                                                            id="quiz-passing"
                                                            type="number"
                                                            value={newQuiz.passingScore}
                                                            onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) })}
                                                            min="1"
                                                            max="100"
                                                        />
                                                    </div>

                                                    <div className="border-t pt-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <Label>Questions</Label>
                                                            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Add Question
                                                            </Button>
                                                        </div>

                                                        <div className="space-y-4">
                                                            {quizQuestions.map((question, qIndex) => (
                                                                <Card key={qIndex} className="p-4">
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <Label>Question {qIndex + 1}</Label>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => removeQuestion(qIndex)}
                                                                        >
                                                                            <XCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>

                                                                    <div className="grid gap-3">
                                                                        <Input
                                                                            placeholder="Enter your question"
                                                                            value={question.question}
                                                                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                                        />

                                                                        <div className="grid gap-2">
                                                                            <Label>Options:</Label>
                                                                            {question.options.map((option, oIndex) => (
                                                                                <div key={oIndex} className="flex items-center gap-2">
                                                                                    <RadioGroup
                                                                                        value={question.correctAnswer.toString()}
                                                                                        onValueChange={(value) => updateQuestion(qIndex, 'correctAnswer', parseInt(value))}
                                                                                    >
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                                                                                            <Label htmlFor={`q${qIndex}-o${oIndex}`}>Correct Answer</Label>
                                                                                        </div>
                                                                                    </RadioGroup>
                                                                                    <Input
                                                                                        placeholder={`Option ${oIndex + 1}`}
                                                                                        value={option}
                                                                                        onChange={(e) => {
                                                                                            const newOptions = [...question.options];
                                                                                            newOptions[oIndex] = e.target.value;
                                                                                            updateQuestion(qIndex, 'options', newOptions);
                                                                                        }}
                                                                                        className="flex-1"
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <DialogFooter>
                                                    <Button onClick={createQuiz} disabled={quizQuestions.length === 0}>
                                                        Create Quiz
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="mt-6">
                    <div className="grid gap-4">
                        {quizzes.map((quiz) => {
                            const questions = quiz.questions as QuizQuestion[];
                            return (
                                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
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
                    <div className="grid gap-4">
                        {quizAttempts.map((attempt) => {
                            const quiz = quizzes.find(q => q.id === attempt.quiz_id);
                            return (
                                <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">You</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {quiz?.title || 'Unknown Quiz'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-stemPurple">
                                                    {attempt.percentage}%
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {attempt.score}/{attempt.total_questions} correct
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString() : 'Unknown'}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {quizAttempts.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No quiz results yet.</p>
                                <p className="text-sm">Take a quiz to see results here.</p>
                            </div>
                        )}
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
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm truncate">
                                                    {member.user_id === user.id ? 'You' : 'User'}
                                                </span>
                                                {member.role === 'owner' && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Owner
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${member.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                <span className="text-xs text-muted-foreground">
                                                    {member.is_online ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                            Question {currentQuestionIndex + 1} of {(currentQuiz.questions as QuizQuestion[]).length}
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
                                                {(currentQuiz.questions as QuizQuestion[])[currentQuestionIndex].question}
                                            </h3>

                                            <RadioGroup
                                                value={userAnswers[currentQuestionIndex] >= 0 ? userAnswers[currentQuestionIndex].toString() : ''}
                                                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                                            >
                                                <div className="space-y-3">
                                                    {(currentQuiz.questions as QuizQuestion[])[currentQuestionIndex].options.map((option, index) => (
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
                                                {currentQuestionIndex === (currentQuiz.questions as QuizQuestion[]).length - 1 ? 'Finish Quiz' : 'Next'}
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
                                        <p className="text-lg">
                                            You scored {quizAttempts[quizAttempts.length - 1]?.score} out of {(currentQuiz.questions as QuizQuestion[]).length}
                                        </p>
                                        <p className="text-2xl font-bold text-stemPurple">
                                            {quizAttempts[quizAttempts.length - 1]?.percentage}%
                                        </p>
                                        <div className="flex gap-2 justify-center">
                                            <Button onClick={() => setActiveTab('results')}>
                                                View All Results
                                            </Button>
                                            <Button variant="outline" onClick={() => setCurrentQuiz(null)}>
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
        </div>
    );
};

export default RoomDetail;
