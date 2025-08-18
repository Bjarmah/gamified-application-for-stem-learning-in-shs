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
    FileText,
    Trash2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { RoomService, CreateRoomData } from '@/services/roomService';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Room {
    id: string;
    name: string;
    description: string | null;
    room_code: string | null;
    max_members: number | null;
    is_public: boolean | null;
    subject_id: string | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: string | null;
    memberCount?: number;
    quizCount?: number;
    subject?: string;
}

const Rooms = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [activeTab, setActiveTab] = useState('my-rooms');
    const [loading, setLoading] = useState(false);

    const [newRoom, setNewRoom] = useState({
        name: '',
        description: '',
        isPublic: false,
        subjectId: '',
        maxMembers: 50
    });

    const [rooms, setRooms] = useState<Room[]>([]);
    const [myRooms, setMyRooms] = useState<Room[]>([]);
    const [discoverableRooms, setDiscoverableRooms] = useState<Room[]>([]);

    useEffect(() => {
        if (user) {
            loadRooms();
        }
    }, [user]);

    const loadRooms = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Load user's rooms
            const userRooms = await RoomService.getUserRooms(user.id);
            setMyRooms(userRooms);

            // Load discoverable rooms
            const discoverable = await RoomService.getDiscoverableRooms(user.id);
            setDiscoverableRooms(discoverable);

            // Combine all rooms for search
            setRooms([...userRooms, ...discoverable]);
        } catch (error) {
            console.error('Error loading rooms:', error);
            toast({
                title: "Error",
                description: "Failed to load rooms. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (roomId: string) => {
        if (!user) return;

        try {
            const success = await RoomService.joinRoomByCode(joinCode, user.id);
            if (success) {
                toast({
                    title: "Joined Room",
                    description: "You have successfully joined this room."
                });
                setJoinCode('');
                loadRooms(); // Reload rooms to update the lists
            } else {
                toast({
                    title: "Failed to Join",
                    description: "Unable to join the room. Please check the code and try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error joining room:', error);
            toast({
                title: "Error",
                description: "Failed to join room. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleJoinByCode = async () => {
        if (!user || !joinCode.trim()) return;

        try {
            const success = await RoomService.joinRoomByCode(joinCode.trim(), user.id);
            if (success) {
                toast({
                    title: "Joined Room",
                    description: "You have successfully joined this room."
                });
                setJoinCode('');
                loadRooms(); // Reload rooms to update the lists
            } else {
                toast({
                    title: "Failed to Join",
                    description: "Unable to join the room. Please check the code and try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error joining room:', error);
            toast({
                title: "Error",
                description: "Failed to join room. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleCreateRoom = async () => {
        if (!user || !newRoom.name.trim() || !newRoom.description.trim()) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        try {
            const roomData: CreateRoomData = {
                name: newRoom.name.trim(),
                description: newRoom.description.trim(),
                subjectId: newRoom.subjectId.trim() || undefined, // Only include if provided
                isPublic: newRoom.isPublic,
                maxMembers: newRoom.maxMembers
            };

            console.log('Creating room with data:', roomData);
            const result = await RoomService.createRoom(roomData, user.id);
            console.log('Room creation result:', result);
            if (result) {
                toast({
                    title: "Room Created",
                    description: `${newRoom.name} has been created successfully with code: ${result.roomCode}`
                });

                setNewRoom({
                    name: '',
                    description: '',
                    isPublic: false,
                    subjectId: '',
                    maxMembers: 50
                });

                loadRooms(); // Reload rooms to show the new room
            } else {
                toast({
                    title: "Error",
                    description: "Failed to create room. Please try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error creating room:', error);
            toast({
                title: "Error",
                description: "Failed to create room. Please try again.",
                variant: "destructive"
            });
        }
    };

    const copyRoomCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Code Copied",
            description: "Room code copied to clipboard."
        });
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (!user) return;

        try {
            const success = await RoomService.deleteRoom(roomId, user.id);
            if (success) {
                toast({
                    title: "Room Deleted",
                    description: "Room has been deleted successfully."
                });
                loadRooms(); // Reload rooms to update the lists
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

    const filteredRooms = (roomList: Room[]) => {
        if (!searchQuery) return roomList;
        return roomList.filter(room =>
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (room.room_code && room.room_code.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    };

    const getSubjectColor = (subjectId: string | null) => {
        // You can implement subject color logic here based on subject_id
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    };

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto pb-8">
                <div className="text-center py-8">
                    <p>Please log in to access study rooms.</p>
                </div>
            </div>
        );
    }

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
                                    value={newRoom.subjectId}
                                    onChange={(e) => setNewRoom({ ...newRoom, subjectId: e.target.value })}
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
                                    id="room-public"
                                    checked={newRoom.isPublic}
                                    onChange={(e) => setNewRoom({ ...newRoom, isPublic: e.target.checked })}
                                />
                                <label htmlFor="room-public" className="text-sm font-medium">
                                    Make room public (discoverable by others)
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
                        <Button onClick={handleJoinByCode} disabled={!joinCode.trim()}>
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
                        placeholder="Search rooms by name, description, or code..."
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
                    {loading ? (
                        <div className="text-center py-8">
                            <p>Loading your rooms...</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredRooms(myRooms).map((room) => (
                                <Card key={room.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold">{room.name}</h3>
                                                    <Badge className={getSubjectColor(room.subject_id)}>
                                                        {room.subject_id || 'General'}
                                                    </Badge>
                                                    {!room.is_public && (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            Private
                                                        </Badge>
                                                    )}
                                                </div>

                                                <p className="text-muted-foreground mb-3">{room.description}</p>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Hash className="h-4 w-4" />
                                                        Code: {room.room_code}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        Created {room.created_at ? new Date(room.created_at).toLocaleDateString() : 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyRoomCode(room.room_code || '')}
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
                                                {room.created_by === user.id && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteRoom(room.id)}
                                                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Delete
                                                    </Button>
                                                )}
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
                    )}
                </TabsContent>

                <TabsContent value="discover" className="mt-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <p>Loading discoverable rooms...</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredRooms(discoverableRooms).map((room) => (
                                <Card key={room.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold">{room.name}</h3>
                                                    <Badge className={getSubjectColor(room.subject_id)}>
                                                        {room.subject_id || 'General'}
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Globe className="h-3 w-3" />
                                                        Public
                                                    </Badge>
                                                </div>

                                                <p className="text-muted-foreground mb-3">{room.description}</p>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Hash className="h-4 w-4" />
                                                        Code: {room.room_code}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        Created {room.created_at ? new Date(room.created_at).toLocaleDateString() : 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyRoomCode(room.room_code || '')}
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
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Rooms;
