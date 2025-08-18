import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    Plus,
    Users,
    MessageSquare,
    Hash,
    Copy,
    ExternalLink,
    Clock,
    UserPlus,
    Lock,
    Globe,
    FileText
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";

interface Room {
    id: string;
    name: string;
    description: string;
    code: string;
    memberCount: number;
    maxMembers: number;
    isPrivate: boolean;
    subject: string;
    createdAt: Date;
    lastActivity: Date;
    isMember: boolean;
    quizCount: number;
    owner: {
        id: string;
        name: string;
        avatar: string;
    };
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
}

const Rooms = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [activeTab, setActiveTab] = useState('my-rooms');

    const [newRoom, setNewRoom] = useState({
        name: '',
        description: '',
        isPrivate: false,
        subject: '',
        maxMembers: 50
    });

    // Demo data - would come from API in a real app
    const [rooms, setRooms] = useState<Room[]>([
        {
            id: 'physics-study-1',
            name: 'Physics Study Group',
            description: 'Weekly physics study sessions for SHS students. We cover mechanics, thermodynamics, and modern physics.',
            code: 'PHYSICS2024',
            memberCount: 24,
            maxMembers: 50,
            isPrivate: false,
            subject: 'Physics',
            createdAt: new Date('2024-01-15'),
            lastActivity: new Date('2024-01-20T14:30:00'),
            isMember: true,
            quizCount: 2,
            owner: {
                id: 'user-1',
                name: 'Kwame Asante',
                avatar: '/placeholder.svg'
            }
        },
        {
            id: 'chemistry-lab-1',
            name: 'Chemistry Lab Partners',
            description: 'Collaborative chemistry experiments and problem-solving. Share lab results and help each other understand concepts.',
            code: 'CHEMLAB24',
            memberCount: 18,
            maxMembers: 30,
            isPrivate: false,
            subject: 'Chemistry',
            createdAt: new Date('2024-01-10'),
            lastActivity: new Date('2024-01-20T16:45:00'),
            isMember: true,
            quizCount: 1,
            owner: {
                id: 'user-2',
                name: 'Ama Boateng',
                avatar: '/placeholder.svg'
            }
        },
        {
            id: 'math-club-1',
            name: 'Math Problem Solvers',
            description: 'Advanced mathematics discussion and problem-solving. Calculus, algebra, and geometry challenges.',
            code: 'MATHCLUB',
            memberCount: 32,
            maxMembers: 40,
            isPrivate: false,
            subject: 'Mathematics',
            createdAt: new Date('2024-01-05'),
            lastActivity: new Date('2024-01-20T12:15:00'),
            isMember: false,
            quizCount: 3,
            owner: {
                id: 'user-3',
                name: 'Kofi Mensah',
                avatar: '/placeholder.svg'
            }
        },
        {
            id: 'biology-study-1',
            name: 'Biology Study Room',
            description: 'Biology concepts, cell biology, genetics, and ecology discussions. Perfect for exam preparation.',
            code: 'BIO2024',
            memberCount: 15,
            maxMembers: 25,
            isPrivate: true,
            subject: 'Biology',
            createdAt: new Date('2024-01-12'),
            lastActivity: new Date('2024-01-20T10:20:00'),
            isMember: false,
            quizCount: 0,
            owner: {
                id: 'user-4',
                name: 'Efua Osei',
                avatar: '/placeholder.svg'
            }
        }
    ]);

    const [myRooms, setMyRooms] = useState<Room[]>([]);
    const [discoverableRooms, setDiscoverableRooms] = useState<Room[]>([]);

    useEffect(() => {
        // Filter rooms based on membership
        setMyRooms(rooms.filter(room => room.isMember));
        setDiscoverableRooms(rooms.filter(room => !room.isMember && !room.isPrivate));
    }, [rooms]);

    const handleJoinRoom = (roomId: string) => {
        setRooms(rooms.map(room =>
            room.id === roomId
                ? { ...room, isMember: true, memberCount: room.memberCount + 1 }
                : room
        ));

        toast({
            title: "Joined Room",
            description: "You have successfully joined this room."
        });
    };

    const handleJoinByCode = () => {
        if (joinCode.trim()) {
            const room = rooms.find(r => r.code === joinCode.trim().toUpperCase());
            if (room) {
                if (room.isMember) {
                    toast({
                        title: "Already a Member",
                        description: "You are already a member of this room."
                    });
                } else if (room.memberCount >= room.maxMembers) {
                    toast({
                        title: "Room Full",
                        description: "This room has reached its maximum capacity."
                    });
                } else {
                    handleJoinRoom(room.id);
                    setJoinCode('');
                }
            } else {
                toast({
                    title: "Invalid Code",
                    description: "No room found with this code. Please check and try again.",
                    variant: "destructive"
                });
            }
        }
    };

    const handleCreateRoom = () => {
        if (newRoom.name.trim() && newRoom.description.trim() && newRoom.subject.trim()) {
            const code = generateRoomCode();
            const newRoomItem: Room = {
                id: `room-${Date.now()}`,
                name: newRoom.name,
                description: newRoom.description,
                code: code,
                memberCount: 1,
                maxMembers: newRoom.maxMembers,
                isPrivate: newRoom.isPrivate,
                subject: newRoom.subject,
                createdAt: new Date(),
                lastActivity: new Date(),
                isMember: true,
                owner: {
                    id: 'current-user',
                    name: 'You',
                    avatar: '/placeholder.svg'
                }
            };

            setRooms([...rooms, newRoomItem]);

            setNewRoom({
                name: '',
                description: '',
                isPrivate: false,
                subject: '',
                maxMembers: 50
            });

            toast({
                title: "Room Created",
                description: `${newRoom.name} has been created successfully with code: ${code}`
            });
        }
    };

    const generateRoomCode = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const copyRoomCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Code Copied",
            description: "Room code copied to clipboard."
        });
    };

    const filteredRooms = (roomList: Room[]) => {
        if (!searchQuery) return roomList;
        return roomList.filter(room =>
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getSubjectColor = (subject: string) => {
        const colors: { [key: string]: string } = {
            'Physics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
            'Chemistry': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            'Mathematics': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
            'Biology': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
        };
        return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    };

    return (
        <div className="max-w-7xl mx-auto pb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Study Rooms</h1>
                    <p className="text-muted-foreground">
                        Join study rooms using codes or discover new learning spaces. Room owners can create quizzes for collaborative learning!
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Study Room</DialogTitle>
                            <DialogDescription>
                                Create a new study room and get a unique code for others to join. Room owners can create quizzes for members to test their knowledge.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="room-name" className="text-sm font-medium">
                                    Room Name
                                </label>
                                <Input
                                    id="room-name"
                                    value={newRoom.name}
                                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                    placeholder="E.g., Physics Study Group"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="room-subject" className="text-sm font-medium">
                                    Subject
                                </label>
                                <Input
                                    id="room-subject"
                                    value={newRoom.subject}
                                    onChange={(e) => setNewRoom({ ...newRoom, subject: e.target.value })}
                                    placeholder="E.g., Physics, Chemistry, Mathematics"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="room-description" className="text-sm font-medium">
                                    Description
                                </label>
                                <Textarea
                                    id="room-description"
                                    value={newRoom.description}
                                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                    placeholder="Describe the purpose of your study room"
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="room-max-members" className="text-sm font-medium">
                                    Maximum Members
                                </label>
                                <Input
                                    id="room-max-members"
                                    type="number"
                                    value={newRoom.maxMembers}
                                    onChange={(e) => setNewRoom({ ...newRoom, maxMembers: parseInt(e.target.value) })}
                                    min="2"
                                    max="100"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="room-private"
                                    checked={newRoom.isPrivate}
                                    onChange={(e) => setNewRoom({ ...newRoom, isPrivate: e.target.checked })}
                                />
                                <label htmlFor="room-private" className="text-sm font-medium">
                                    Make room private (only accessible via code)
                                </label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleCreateRoom}>Create Room</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Join Room by Code */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Join Room by Code
                    </CardTitle>
                    <CardDescription>
                        Enter a room code to join an existing study room
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter room code (e.g., PHYSICS2024)"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            className="flex-1"
                        />
                        <Button onClick={handleJoinByCode}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Join Room
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search rooms by name, description, subject, or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="my-rooms">My Rooms ({myRooms.length})</TabsTrigger>
                    <TabsTrigger value="discover">Discover Rooms ({discoverableRooms.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="my-rooms" className="mt-6">
                    <div className="grid gap-4">
                        {filteredRooms(myRooms).map((room) => (
                            <Card key={room.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{room.name}</h3>
                                                <Badge className={getSubjectColor(room.subject)}>
                                                    {room.subject}
                                                </Badge>
                                                {room.isPrivate && (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Lock className="h-3 w-3" />
                                                        Private
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-muted-foreground mb-3">{room.description}</p>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {room.memberCount}/{room.maxMembers} members
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FileText className="h-4 w-4" />
                                                    {room.quizCount} quiz{room.quizCount !== 1 ? 'es' : ''}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    Last active {room.lastActivity.toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Hash className="h-4 w-4" />
                                                    Code: {room.code}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyRoomCode(room.code)}
                                                className="flex items-center gap-1"
                                            >
                                                <Copy className="h-3 w-3" />
                                                Copy Code
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/rooms/${room.id}`)}
                                                className="flex items-center gap-1"
                                            >
                                                <MessageSquare className="h-3 w-3" />
                                                Enter Room
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredRooms(myRooms).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No rooms found.</p>
                                <p className="text-sm">Create a room or join one using a code to get started.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="discover" className="mt-6">
                    <div className="grid gap-4">
                        {filteredRooms(discoverableRooms).map((room) => (
                            <Card key={room.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{room.name}</h3>
                                                <Badge className={getSubjectColor(room.subject)}>
                                                    {room.subject}
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    Public
                                                </Badge>
                                            </div>

                                            <p className="text-muted-foreground mb-3">{room.description}</p>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {room.memberCount}/{room.maxMembers} members
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FileText className="h-4 w-4" />
                                                    {room.quizCount} quiz{room.quizCount !== 1 ? 'es' : ''}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    Last active {room.lastActivity.toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Hash className="h-4 w-4" />
                                                    Code: {room.code}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyRoomCode(room.code)}
                                                className="flex items-center gap-1"
                                            >
                                                <Copy className="h-3 w-3" />
                                                Copy Code
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleJoinRoom(room.id)}
                                                className="flex items-center gap-1"
                                            >
                                                <UserPlus className="h-3 w-3" />
                                                Join Room
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredRooms(discoverableRooms).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No discoverable rooms found.</p>
                                <p className="text-sm">Try adjusting your search or ask friends for room codes.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Rooms;
