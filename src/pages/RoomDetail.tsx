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
    Clock
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface RoomMember {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    role: 'owner' | 'member';
}

interface RoomMessage {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    timestamp: Date;
    type: 'message' | 'system';
}

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    timeLimit?: number; // in minutes
    createdAt: Date;
    isActive: boolean;
}

interface QuizAttempt {
    id: string;
    quizId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: Date;
    answers: number[];
}

const RoomDetail = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState<any>(null);
    const [members, setMembers] = useState<RoomMember[]>([]);
    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const [activeTab, setActiveTab] = useState('chat');

    // Quiz states
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
    const [showQuizResults, setShowQuizResults] = useState(false);

    // Quiz creation states
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        description: '',
        timeLimit: 15
    });
    const [quizQuestions, setQuizQuestions] = useState<Omit<QuizQuestion, 'id'>[]>([]);

    useEffect(() => {
        // In a real app, this would fetch room data from API
        // For now, using demo data
        setRoom({
            id: roomId,
            name: 'Physics Study Group',
            description: 'Weekly physics study sessions for SHS students.',
            code: 'PHYSICS2024',
            memberCount: 24,
            maxMembers: 50,
            subject: 'Physics'
        });

        setMembers([
            {
                id: 'user-1',
                name: 'Kwame Asante',
                avatar: '/placeholder.svg',
                isOnline: true,
                role: 'owner'
            },
            {
                id: 'user-2',
                name: 'Ama Boateng',
                avatar: '/placeholder.svg',
                isOnline: true,
                role: 'member'
            },
            {
                id: 'user-3',
                name: 'Kofi Mensah',
                avatar: '/placeholder.svg',
                isOnline: false,
                role: 'member'
            }
        ]);

        setMessages([
            {
                id: 'msg-1',
                content: 'Welcome to the Physics Study Group!',
                author: {
                    id: 'system',
                    name: 'System',
                    avatar: '/placeholder.svg'
                },
                timestamp: new Date('2024-01-20T10:00:00'),
                type: 'system'
            },
            {
                id: 'msg-2',
                content: 'Hi everyone! Ready for today\'s session on mechanics?',
                author: {
                    id: 'user-1',
                    name: 'Kwame Asante',
                    avatar: '/placeholder.svg'
                },
                timestamp: new Date('2024-01-20T10:01:00'),
                type: 'message'
            },
            {
                id: 'msg-3',
                content: 'Yes! I have some questions about Newton\'s laws',
                author: {
                    id: 'user-2',
                    name: 'Ama Boateng',
                    avatar: '/placeholder.svg'
                },
                timestamp: new Date('2024-01-20T10:02:00'),
                type: 'message'
            }
        ]);

        // Demo quizzes
        setQuizzes([
            {
                id: 'quiz-1',
                title: 'Newton\'s Laws Quiz',
                description: 'Test your knowledge of Newton\'s three laws of motion',
                questions: [
                    {
                        id: 'q1',
                        question: 'What is Newton\'s First Law also known as?',
                        options: ['Law of Action and Reaction', 'Law of Inertia', 'Law of Acceleration', 'Law of Motion'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q2',
                        question: 'Which law states that force equals mass times acceleration?',
                        options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q3',
                        question: 'For every action, there is an equal and opposite reaction. This is:',
                        options: ['First Law', 'Second Law', 'Third Law', 'Law of Conservation'],
                        correctAnswer: 2
                    }
                ],
                timeLimit: 10,
                createdAt: new Date('2024-01-20T09:00:00'),
                isActive: true
            }
        ]);

        // Demo quiz attempts
        setQuizAttempts([
            {
                id: 'attempt-1',
                quizId: 'quiz-1',
                userId: 'user-2',
                userName: 'Ama Boateng',
                userAvatar: '/placeholder.svg',
                score: 2,
                totalQuestions: 3,
                percentage: 67,
                completedAt: new Date('2024-01-20T10:30:00'),
                answers: [1, 1, 2]
            }
        ]);
    }, [roomId]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage: RoomMessage = {
                id: `msg-${Date.now()}`,
                content: message.trim(),
                author: {
                    id: 'current-user',
                    name: 'You',
                    avatar: '/placeholder.svg'
                },
                timestamp: new Date(),
                type: 'message'
            };

            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const copyRoomCode = () => {
        if (room?.code) {
            navigator.clipboard.writeText(room.code);
            toast({
                title: "Code Copied",
                description: "Room code copied to clipboard."
            });
        }
    };

    const handleLeaveRoom = () => {
        toast({
            title: "Left Room",
            description: "You have left the room."
        });
        navigate('/rooms');
    };

    // Quiz functions
    const startQuiz = (quiz: Quiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(quiz.questions.length).fill(-1));
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
        if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
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

    const finishQuiz = () => {
        if (!currentQuiz) return;

        const score = userAnswers.reduce((acc, answer, index) => {
            return acc + (answer === currentQuiz.questions[index].correctAnswer ? 1 : 0);
        }, 0);

        const percentage = Math.round((score / currentQuiz.questions.length) * 100);

        const newAttempt: QuizAttempt = {
            id: `attempt-${Date.now()}`,
            quizId: currentQuiz.id,
            userId: 'current-user',
            userName: 'You',
            userAvatar: '/placeholder.svg',
            score,
            totalQuestions: currentQuiz.questions.length,
            percentage,
            completedAt: new Date(),
            answers: [...userAnswers]
        };

        setQuizAttempts([...quizAttempts, newAttempt]);
        setShowQuizResults(true);
    };

    const createQuiz = () => {
        if (newQuiz.title.trim() && newQuiz.description.trim() && quizQuestions.length > 0) {
            const newQuizItem: Quiz = {
                id: `quiz-${Date.now()}`,
                title: newQuiz.title,
                description: newQuiz.description,
                questions: quizQuestions.map((q, index) => ({
                    ...q,
                    id: `q${index + 1}`
                })),
                timeLimit: newQuiz.timeLimit,
                createdAt: new Date(),
                isActive: true
            };

            setQuizzes([...quizzes, newQuizItem]);
            setNewQuiz({ title: '', description: '', timeLimit: 15 });
            setQuizQuestions([]);
            setShowCreateQuiz(false);

            toast({
                title: "Quiz Created",
                description: `${newQuiz.title} has been created successfully.`
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

    const updateQuestion = (index: number, field: keyof Omit<QuizQuestion, 'id'>, value: any) => {
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

    const isRoomOwner = members.find(m => m.id === 'current-user')?.role === 'owner';

    if (!room) {
        return <div>Loading...</div>;
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
                        {room.subject}
                    </Badge>
                    <Button variant="outline" onClick={copyRoomCode}>
                        <Hash className="h-4 w-4 mr-2" />
                        {room.code}
                        <Copy className="h-4 w-4 ml-2" />
                    </Button>
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
                    <TabsTrigger value="members">Members</TabsTrigger>
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
                                            <div key={msg.id} className={`flex gap-3 ${msg.type === 'system' ? 'justify-center' : ''}`}>
                                                {msg.type === 'system' ? (
                                                    <div className="text-center">
                                                        <Badge variant="outline" className="text-xs">
                                                            {msg.content}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={msg.author.avatar} />
                                                            <AvatarFallback>{msg.author.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-sm">{msg.author.name}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {msg.timestamp.toLocaleTimeString()}
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
                        {quizzes.map((quiz) => (
                            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {quiz.questions.length} questions
                                                </Badge>
                                                {quiz.timeLimit && (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {quiz.timeLimit} min
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-muted-foreground mb-3">{quiz.description}</p>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Trophy className="h-4 w-4" />
                                                    {quizAttempts.filter(a => a.quizId === quiz.id).length} attempts
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    Created {quiz.createdAt.toLocaleDateString()}
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
                        ))}

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
                            const quiz = quizzes.find(q => q.id === attempt.quizId);
                            return (
                                <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={attempt.userAvatar} />
                                                    <AvatarFallback>{attempt.userName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">{attempt.userName}</h3>
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
                                                    {attempt.score}/{attempt.totalQuestions} correct
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {attempt.completedAt.toLocaleDateString()}
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
                                Members ({members.length}/{room.maxMembers})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm truncate">{member.name}</span>
                                                {member.role === 'owner' && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Owner
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                <span className="text-xs text-muted-foreground">
                                                    {member.isOnline ? 'Online' : 'Offline'}
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
                                            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                                        </Badge>
                                        {quizStartTime && currentQuiz.timeLimit && (
                                            <Badge variant="outline">
                                                Time: {Math.max(0, currentQuiz.timeLimit - Math.floor((Date.now() - quizStartTime.getTime()) / 60000))} min
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
                                                {currentQuiz.questions[currentQuestionIndex].question}
                                            </h3>

                                            <RadioGroup
                                                value={userAnswers[currentQuestionIndex] >= 0 ? userAnswers[currentQuestionIndex].toString() : ''}
                                                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                                            >
                                                <div className="space-y-3">
                                                    {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
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
                                                {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
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
                                            You scored {quizAttempts[quizAttempts.length - 1]?.score} out of {currentQuiz.questions.length}
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
