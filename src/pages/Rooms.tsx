
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, MessageSquare } from 'lucide-react';
import RoomCard, { RoomProps } from '@/components/rooms/RoomCard';
import { useToast } from "@/hooks/use-toast";

const Rooms = () => {
  const { toast } = useToast();
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    subject: '',
    topic: '',
    teacherLed: false
  });

  // Demo data - would come from API in a real app
  const [rooms, setRooms] = useState<RoomProps[]>([
    {
      id: 'physics-help',
      name: 'Physics Help Room',
      description: 'Get help with physics problems and concepts. Ask questions and collaborate on solutions.',
      subject: 'Physics',
      topic: 'Mechanics',
      participantCount: 12,
      isActive: true,
      teacherLed: true,
      imageUrl: '/placeholder.svg',
      hasJoined: true,
    },
    {
      id: 'chemistry-study',
      name: 'Chemistry Study Group',
      description: 'Preparing for the upcoming chemistry test. Join to study together and share notes.',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      participantCount: 8,
      isActive: true,
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'math-problems',
      name: 'Math Problem Solving',
      description: 'Work through difficult math problems together. Share different approaches and learn from each other.',
      subject: 'Mathematics',
      topic: 'Calculus',
      participantCount: 15,
      isActive: true,
      teacherLed: false,
      imageUrl: '/placeholder.svg',
      hasJoined: true,
    },
    {
      id: 'biology-discussion',
      name: 'Biology Discussion',
      description: 'Discuss biology topics, share interesting facts, and help each other understand complex concepts.',
      subject: 'Biology',
      topic: 'Genetics',
      participantCount: 6,
      isActive: false,
      teacherLed: false,
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'physics-revision',
      name: 'Physics Exam Revision',
      description: 'Preparing for the final physics exam. Review key concepts and practice questions.',
      subject: 'Physics',
      topic: 'Electromagnetism',
      participantCount: 20,
      isActive: true,
      teacherLed: true,
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'computer-science',
      name: 'Computer Science Projects',
      description: 'Discuss ongoing projects, programming challenges, and computer science concepts.',
      subject: 'Computer Science',
      topic: 'Algorithms',
      participantCount: 10,
      isActive: false,
      teacherLed: false,
      imageUrl: '/placeholder.svg',
    }
  ]);

  const handleJoinRoom = (roomId: string) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, hasJoined: true, participantCount: room.participantCount + 1 }
        : room
    ));
    
    toast({
      title: "Joined Room",
      description: "You have successfully joined this room."
    });
  };

  const handleCreateRoom = () => {
    if (newRoom.name.trim() && newRoom.description.trim() && newRoom.subject) {
      const newRoomItem: RoomProps = {
        id: `room-${Date.now()}`,
        name: newRoom.name,
        description: newRoom.description,
        subject: newRoom.subject,
        topic: newRoom.topic || undefined,
        participantCount: 1,
        isActive: true,
        teacherLed: newRoom.teacherLed,
        hasJoined: true,
      };
      
      setRooms([...rooms, newRoomItem]);
      
      setNewRoom({
        name: '',
        description: '',
        subject: '',
        topic: '',
        teacherLed: false
      });
      
      toast({
        title: "Room Created",
        description: `${newRoom.name} has been created successfully.`
      });
    }
  };

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", 
    "Engineering", "Environmental Science", "Astronomy"
  ];

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Study Rooms</h1>
          <p className="text-muted-foreground">
            Join virtual study rooms to learn and collaborate with peers.
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
              <DialogTitle>Create Study Room</DialogTitle>
              <DialogDescription>
                Create a new room for focused discussions and collaborative learning.
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
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  placeholder="E.g., Physics Problem Solving"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="room-subject" className="text-sm font-medium">
                  Subject
                </label>
                <Select 
                  value={newRoom.subject}
                  onValueChange={(value) => setNewRoom({...newRoom, subject: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="room-topic" className="text-sm font-medium">
                  Topic (Optional)
                </label>
                <Input
                  id="room-topic"
                  value={newRoom.topic}
                  onChange={(e) => setNewRoom({...newRoom, topic: e.target.value})}
                  placeholder="E.g., Mechanics, Calculus, Genetics"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="room-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="room-description"
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                  placeholder="Describe the purpose of this room"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="teacher-led"
                  checked={newRoom.teacherLed}
                  onChange={(e) => setNewRoom({...newRoom, teacherLed: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="teacher-led" className="text-sm font-medium">
                  Teacher-led Room
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleCreateRoom}
                disabled={!newRoom.name.trim() || !newRoom.description.trim() || !newRoom.subject}
              >
                Create Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search rooms..." 
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Rooms</TabsTrigger>
          <TabsTrigger value="active">Active Now</TabsTrigger>
          <TabsTrigger value="joined">My Rooms</TabsTrigger>
          <TabsTrigger value="teacher">Teacher-led</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                {...room}
                onJoin={handleJoinRoom}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms
              .filter(room => room.isActive)
              .map((room) => (
                <RoomCard
                  key={room.id}
                  {...room}
                  onJoin={handleJoinRoom}
                />
              ))}
              
            {rooms.filter(room => room.isActive).length === 0 && (
              <div className="col-span-full text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No active rooms</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There are no active rooms at the moment.
                </p>
                <Button onClick={() => document.querySelector('[value="all"]')?.dispatchEvent(new Event('click'))}>
                  View All Rooms
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="joined" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms
              .filter(room => room.hasJoined)
              .map((room) => (
                <RoomCard
                  key={room.id}
                  {...room}
                />
              ))}
              
            {rooms.filter(room => room.hasJoined).length === 0 && (
              <div className="col-span-full text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No rooms joined</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't joined any rooms yet.
                </p>
                <Button variant="outline" onClick={() => document.querySelector('[value="all"]')?.dispatchEvent(new Event('click'))}>
                  Explore Rooms
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="teacher" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms
              .filter(room => room.teacherLed)
              .map((room) => (
                <RoomCard
                  key={room.id}
                  {...room}
                  onJoin={handleJoinRoom}
                />
              ))}
              
            {rooms.filter(room => room.teacherLed).length === 0 && (
              <div className="col-span-full text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No teacher-led rooms</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There are no teacher-led rooms available at the moment.
                </p>
                <Button onClick={() => document.querySelector('[value="all"]')?.dispatchEvent(new Event('click'))}>
                  View All Rooms
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rooms;
