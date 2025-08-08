import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    BookOpen,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    Palette
} from 'lucide-react';

interface Subject {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    created_at: string;
}

const AdminSubjects = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#6366f1',
        icon: 'BookOpen'
    });

    // Check if user is admin
    if (!profile || profile.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                        <p className="text-muted-foreground mb-4">
                            You don't have permission to access this page.
                        </p>
                        <Button onClick={() => navigate('/admin')}>
                            Go to Admin Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const { data, error } = await supabase
                .from('subjects')
                .select('*')
                .order('name');

            if (error) throw error;
            setSubjects(data || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            toast({
                title: "Error",
                description: "Failed to load subjects",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingSubject) {
                // Update existing subject
                const { error } = await supabase
                    .from('subjects')
                    .update({
                        name: formData.name,
                        description: formData.description || null,
                        color: formData.color,
                        icon: formData.icon
                    })
                    .eq('id', editingSubject.id);

                if (error) throw error;

                toast({
                    title: "Success",
                    description: "Subject updated successfully",
                });
            } else {
                // Create new subject
                const { error } = await supabase
                    .from('subjects')
                    .insert({
                        name: formData.name,
                        description: formData.description || null,
                        color: formData.color,
                        icon: formData.icon
                    });

                if (error) throw error;

                toast({
                    title: "Success",
                    description: "Subject created successfully",
                });
            }

            fetchSubjects();
            handleCloseDialog();
        } catch (error: any) {
            console.error('Error saving subject:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to save subject",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (subjectId: string) => {
        if (!confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', subjectId);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Subject deleted successfully",
            });

            fetchSubjects();
        } catch (error: any) {
            console.error('Error deleting subject:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to delete subject",
                variant: "destructive"
            });
        }
    };

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setFormData({
            name: subject.name,
            description: subject.description || '',
            color: subject.color || '#6366f1',
            icon: subject.icon || 'BookOpen'
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingSubject(null);
        setFormData({
            name: '',
            description: '',
            color: '#6366f1',
            icon: 'BookOpen'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/admin')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/admin')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Subjects</h1>
                    <p className="text-muted-foreground">
                        Create and manage learning subjects
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">Subjects ({subjects.length})</h2>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Subject
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingSubject
                                    ? 'Update the subject information below.'
                                    : 'Create a new subject for your learning platform.'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter subject name"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter subject description"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="color">Color</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-16 h-10"
                                    />
                                    <Input
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="#6366f1"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingSubject ? 'Update' : 'Create'} Subject
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    <Card key={subject.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                                    <Badge
                                        style={{ backgroundColor: subject.color || '#6366f1' }}
                                        className="text-white"
                                    >
                                        {subject.icon || 'BookOpen'}
                                    </Badge>
                                </div>
                                <div className="flex space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(subject)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(subject.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="line-clamp-2">
                                {subject.description || 'No description provided'}
                            </CardDescription>
                            <div className="mt-4 text-sm text-muted-foreground">
                                Created: {new Date(subject.created_at).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminSubjects;
