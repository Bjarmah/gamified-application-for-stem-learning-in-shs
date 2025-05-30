
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Users, BookOpen, Settings } from 'lucide-react';

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // Mock room data
  const room = {
    id: roomId,
    name: 'Physics Problem Solving',
    description: 'Work together on challenging physics problems and share solving strategies',
    subject: 'Physics',
    memberCount: 8,
    maxMembers: 12,
    isActive: true,
    createdBy: 'Kofi Mensah'
  };

  const members = [
    { id: '1', name: 'Kofi Mensah', initials: 'KM', role: 'Admin', isOnline: true },
    { id: '2', name: 'Ama Boateng', initials: 'AB', role: 'Member', isOnline: true },
    { id: '3', name: 'Efua Nyarko', initials: 'EN', role: 'Member', isOnline: false },
    { id: '4', name: 'Kwame Asante', initials: 'KA', role: 'Member', isOnline: true }
  ];

  const messages = [
    {
      id: '1',
      user: 'Kofi Mensah',
      initials: 'KM',
      message: 'Welcome everyone! Let\'s start with the kinematics problems from chapter 3.',
      time: '2:30 PM',
      isOwn: false
    },
    {
      id: '2',
      user: 'Ama Boateng',
      initials: 'AB',
      message: 'I\'m struggling with problem 3.15. Can someone help me understand the velocity calculations?',
      time: '2:32 PM',
      isOwn: false
    },
    {
      id: '3',
      user: 'You',
      initials: 'YU',
      message: 'Sure! Let me break down the problem step by step.',
      time: '2:33 PM',
      isOwn: true
    }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rooms
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <Badge className="bg-stemPurple/20 text-stemPurple">
              <BookOpen className="h-3 w-3 mr-1" />
              {room.subject}
            </Badge>
            <Badge variant={room.isActive ? "default" : "secondary"}>
              {room.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{room.description}</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center">
                Chat
                <Badge variant="outline" className="ml-2">
                  {members.filter(m => m.isOnline).length} online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex space-x-3 max-w-[70%] ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{msg.initials}</AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-3 ${msg.isOwn ? 'bg-stemPurple text-white' : 'bg-muted'}`}>
                        {!msg.isOwn && (
                          <p className="text-xs font-medium mb-1">{msg.user}</p>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.isOwn ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} className="btn-stem">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Members ({members.length}/{room.maxMembers})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                    {member.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-stemGreen rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                      {member.isOnline && (
                        <span className="text-xs text-stemGreen">Online</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Created by</p>
                <p className="text-sm text-muted-foreground">{room.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Subject</p>
                <p className="text-sm text-muted-foreground">{room.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">{room.memberCount}/{room.maxMembers} members</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
