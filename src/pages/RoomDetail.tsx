
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Users } from 'lucide-react';
import RoomMessage, { MessageProps } from '@/components/rooms/RoomMessage';

const RoomDetail = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [newMessage, setNewMessage] = useState('');
  
  // In a real app, these would come from API calls based on roomId
  const room = {
    id: roomId || 'physics-help',
    name: 'Physics Help Room',
    description: 'Get help with physics problems and concepts. Ask questions and collaborate on solutions.',
    subject: 'Physics',
    topic: 'Mechanics',
    participantCount: 12,
    isActive: true,
    teacherLed: true,
    imageUrl: '/placeholder.svg',
  };
  
  const participants = [
    { id: 'user1', name: 'Kwame Asante', avatar: '/placeholder.svg', isTeacher: true },
    { id: 'user2', name: 'Ama Boateng', avatar: '/placeholder.svg' },
    { id: 'user3', name: 'Kofi Mensah', avatar: '/placeholder.svg' },
    { id: 'user4', name: 'Abena Osei', avatar: '/placeholder.svg' },
    { id: 'user5', name: 'Kweku Addai', avatar: '/placeholder.svg' },
    { id: 'currentUser', name: 'You (Student)', avatar: '/placeholder.svg' },
  ];
  
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: 'msg1',
      content: "Welcome everyone to the Physics Help Room! Today we'll be focusing on Newton's Laws of Motion. Feel free to ask questions.",
      sender: participants[0],
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false
    },
    {
      id: 'msg2',
      content: "I'm having trouble understanding the difference between mass and weight. Could someone explain?",
      sender: participants[1],
      timestamp: new Date(Date.now() - 2400000),
      isCurrentUser: false
    },
    {
      id: 'msg3',
      content: "Mass is a measure of the amount of matter in an object, while weight is the force exerted on that mass due to gravity.",
      sender: participants[0],
      timestamp: new Date(Date.now() - 2000000),
      isCurrentUser: false
    },
    {
      id: 'msg4',
      content: "Thanks, that makes sense. So weight can change depending on gravity, but mass stays constant?",
      sender: participants[1],
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false
    },
    {
      id: 'msg5',
      content: "Exactly! Your mass would be the same on Earth and the moon, but your weight would be different.",
      sender: participants[0],
      timestamp: new Date(Date.now() - 1600000),
      isCurrentUser: false
    },
    {
      id: 'msg6',
      content: "I'm still confused about Newton's Third Law. If every action has an equal and opposite reaction, why does anything move at all?",
      sender: participants[5],
      timestamp: new Date(Date.now() - 1000000),
      isCurrentUser: true
    },
  ]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: MessageProps = {
        id: `msg-${Date.now()}`,
        content: newMessage,
        sender: participants[5], // Current user
        timestamp: new Date(),
        isCurrentUser: true
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main chat area */}
        <div className="lg:col-span-3 flex flex-col h-[calc(100vh-200px)]">
          <div className="bg-card rounded-t-lg border p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={room.imageUrl} alt={room.name} />
                  <AvatarFallback>{room.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{room.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{room.subject}</Badge>
                    {room.topic && <Badge variant="outline">{room.topic}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="default" className="bg-green-500 mr-2">Active</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users size={14} className="mr-1" />
                  <span>{room.participantCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-grow bg-white dark:bg-card border-x overflow-y-auto p-4">
            {messages.map((message) => (
              <RoomMessage 
                key={message.id}
                {...message}
              />
            ))}
          </div>
          
          <div className="bg-card rounded-b-lg border p-3">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>
        
        {/* Sidebar with participants */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users size={16} className="mr-2" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{participant.name}</span>
                    </div>
                    {participant.isTeacher && (
                      <Badge className="bg-stemPurple text-xs">Teacher</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare size={16} className="mr-2" />
                About this Room
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Subject:</span>
                  <span className="text-sm">{room.subject}</span>
                </div>
                {room.topic && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Topic:</span>
                    <span className="text-sm">{room.topic}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Teacher-led:</span>
                  <span className="text-sm">{room.teacherLed ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
