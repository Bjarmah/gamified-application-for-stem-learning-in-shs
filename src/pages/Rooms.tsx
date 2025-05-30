
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import RoomCard from "@/components/rooms/RoomCard";
import { Plus, Search, Users } from 'lucide-react';

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock room data for demo
  const rooms = [
    {
      id: 'room-1',
      name: 'Physics Problem Solving',
      description: 'Work together on challenging physics problems and share solving strategies',
      subject: 'Physics',
      memberCount: 8,
      maxMembers: 12,
      isActive: true,
      createdBy: 'Kofi Mensah',
      lastActivity: '5 min ago',
      participants: [
        { initials: 'KM', name: 'Kofi Mensah' },
        { initials: 'AB', name: 'Ama Boateng' },
        { initials: 'EN', name: 'Efua Nyarko' },
        { initials: 'KA', name: 'Kwame Asante' }
      ]
    },
    {
      id: 'room-2',
      name: 'Chemistry Lab Discussion',
      description: 'Discuss lab experiments, share results, and ask questions about procedures',
      subject: 'Chemistry',
      memberCount: 5,
      maxMembers: 10,
      isActive: true,
      createdBy: 'Ama Boateng',
      lastActivity: '12 min ago',
      participants: [
        { initials: 'AB', name: 'Ama Boateng' },
        { initials: 'KM', name: 'Kofi Mensah' },
        { initials: 'EN', name: 'Efua Nyarko' }
      ]
    },
    {
      id: 'room-3',
      name: 'Math Study Group',
      description: 'Collaborative math problem solving and exam preparation',
      subject: 'Mathematics',
      memberCount: 6,
      maxMembers: 8,
      isActive: false,
      createdBy: 'Kwame Asante',
      lastActivity: '2 hours ago',
      participants: [
        { initials: 'KA', name: 'Kwame Asante' },
        { initials: 'EN', name: 'Efua Nyarko' }
      ]
    },
    {
      id: 'room-4',
      name: 'Biology Research Team',
      description: 'Research current biological topics and share interesting findings',
      subject: 'Biology',
      memberCount: 3,
      maxMembers: 6,
      isActive: true,
      createdBy: 'Efua Nyarko',
      lastActivity: '30 min ago',
      participants: [
        { initials: 'EN', name: 'Efua Nyarko' },
        { initials: 'AB', name: 'Ama Boateng' }
      ]
    }
  ];

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRooms = filteredRooms.filter(room => room.isActive).length;
  const totalMembers = filteredRooms.reduce((acc, room) => acc + room.memberCount, 0);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Study Rooms</h1>
        <p className="text-muted-foreground">
          Join virtual study rooms to learn and collaborate with peers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-stemPurple" />
            <div>
              <p className="text-2xl font-bold">{filteredRooms.length}</p>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 bg-stemGreen rounded-full" />
            <div>
              <p className="text-2xl font-bold">{activeRooms}</p>
              <p className="text-sm text-muted-foreground">Active Rooms</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-stemYellow" />
            <div>
              <p className="text-2xl font-bold">{totalMembers}</p>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="btn-stem">
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Subject Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">All Subjects</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Physics</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Chemistry</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Mathematics</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Biology</Badge>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            {...room}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or create a new room.
          </p>
          <Button className="btn-stem">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Room
          </Button>
        </div>
      )}
    </div>
  );
};

export default Rooms;
