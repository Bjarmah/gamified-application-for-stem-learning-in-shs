import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, AlertCircle } from 'lucide-react';
import { getContentById, SearchableContent } from '../content';
import TryHackMeRoom from '../components/TryHackMeRoom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

const RoomDetail: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<SearchableContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (roomId) {
            const foundRoom = getContentById(roomId);
            if (foundRoom && foundRoom.type === 'room') {
                setRoom(foundRoom);
            } else {
                setError('Room not found or invalid room type');
            }
            setLoading(false);
        }
    }, [roomId]);

    const handleRoomComplete = (roomId: string, score: number) => {
        // Handle room completion - could save to user progress, show achievements, etc.
        console.log(`Room ${roomId} completed with score ${score}`);

        // Show completion message
        alert(`Congratulations! You've completed the room with ${score} points!`);
    };

    const handleBackToSearch = () => {
        navigate('/search');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading room...</p>
                </div>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Button
                        variant="outline"
                        onClick={handleBackToSearch}
                        className="mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Search
                    </Button>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error || 'Room not found. Please check the URL and try again.'}
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    // Convert SearchableContent to TryHackMeRoom format
    const roomData = {
        roomId: room.id,
        roomName: room.title,
        difficulty: room.difficulty || 'Unknown',
        category: room.subject,
        tags: room.tags,
        description: room.description,
        estimatedTime: typeof room.estimatedTime === 'string' ? room.estimatedTime : `${room.estimatedTime} min`,
        points: room.points || 0,
        creator: 'Ghana STEM Learning Platform',
        status: 'published',
        tasks: room.content || [],
        achievements: room.achievements || [],
        roomInfo: {
            prerequisites: 'Basic understanding of the subject',
            tools: 'Computer, internet connection',
            learningOutcomes: [
                'Master the core concepts',
                'Apply knowledge to real-world scenarios',
                'Earn points and achievements'
            ],
            estimatedCompletionTime: typeof room.estimatedTime === 'string' ? room.estimatedTime : `${room.estimatedTime} min`,
            difficultyProgression: 'Progressive',
            relatedRooms: []
        },
        ghanaContext: room.ghanaContext || {
            localExamples: [],
            culturalConnections: [],
            realWorldApplications: []
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handleBackToSearch}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Search
                        </Button>

                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {room.title}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {room.subject} • {room.difficulty || 'All Levels'}
                            </p>
                        </div>

                        <div className="text-right">
                            <Badge variant="outline">
                                {room.points || 0} points
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Content */}
            <div className="container mx-auto px-4 py-8">
                <TryHackMeRoom
                    room={roomData}
                    onComplete={handleRoomComplete}
                />
            </div>

            {/* Footer Info */}
            <div className="bg-white border-t mt-12">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-gray-600">
                        <p className="mb-2">
                            This is a TryHackMe-style learning room designed for Ghanaian Senior High School students.
                        </p>
                        <p>
                            Complete all tasks to earn points and unlock achievements.
                            Your progress is saved locally and can be shared with teachers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
