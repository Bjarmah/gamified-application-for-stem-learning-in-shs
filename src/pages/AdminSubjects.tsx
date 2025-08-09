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

    useEffect(() => {
        fetchSubjects();
    }, []);

    // Move admin check inside component
    if (!profile || profile.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
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
        setIsDialogOpen(true);
        setEditingSubject({ id: subjectId } as Subject);
        return;
    };

    const confirmDelete = async () => {
        if (!editingSubject?.id) return;

        try {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', editingSubject.id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Subject deleted successfully",
            });

            fetchSubjects();
            handleCloseDialog();
        } catch (error: any) {
            const errorMessage = error.message === 'ForeignKeyViolationError' 
                ? 'Cannot delete subject because it has associated modules' 
                : 'Failed to delete subject';
            
            toast({
                title: "Error",
                description: errorMessage,
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
                        <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Loading Subjects</h1>
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
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
                    {!editingSubject ? (
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                                Add Subject
                            </Button>
                        </DialogTrigger>
                    ) : null}
                    <DialogContent>
                        {editingSubject?.id && !editingSubject.name ? (
                            // Delete confirmation dialog
                            <>
                                <DialogHeader>
                                    <DialogTitle>Delete Subject</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this subject? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                                    <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                                </DialogFooter>
                            </>
                        ) : (
                            // Add/Edit form dialog
                            <>
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
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= 50) {
                                                    setFormData({ ...formData, name: value });
                                                }
                                            }}
                                            placeholder="Enter subject name"
                                            required
                                            maxLength={50}
                                            aria-describedby="name-description"
                                        />
                                        <p id="name-description" className="text-sm text-muted-foreground mt-1">
                                            Maximum 50 characters
                                        </p>
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= 500) {
                                                    setFormData({ ...formData, description: value });
                                                }
                                            }}
                                            placeholder="Enter subject description"
                                            rows={3}
                                            maxLength={500}
                                            aria-describedby="description-limit"
                                        />
                                        <p id="description-limit" className="text-sm text-muted-foreground mt-1">
                                            {formData.description.length}/500 characters
                                        </p>
                                    </div>
                                    <div>
                                        <Label htmlFor="color">Color</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="color"
                                                type="color"
                                                value={formData.color}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^#[0-9A-F]{6}$/i.test(value)) {
                                                        setFormData({ ...formData, color: value });
                                                    }
                                                }}
                                                className="w-16 h-10"
                                                aria-label="Choose subject color"
                                            />
                                            <Input
                                                value={formData.color}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^#[0-9A-F]{6}$/i.test(value)) {
                                                        setFormData({ ...formData, color: value });
                                                    }
                                                }}
                                                placeholder="#6366f1"
                                                pattern="^#[0-9A-F]{6}$"
                                                title="Please enter a valid hex color code (e.g. #6366f1)"
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
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {subjects.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                        <h3 className="text-lg font-semibold mb-2">No Subjects Yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Get started by adding your first subject.
                        </p>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                                Add First Subject
                            </Button>
                        </DialogTrigger>
                    </CardContent>
                </Card>
            ) : (
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
                                            aria-label={`Edit ${subject.name}`}
                                        >
                                            <Edit className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(subject.id)}
                                            aria-label={`Delete ${subject.name}`}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
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
            )}
        </div>
    );
};

export default AdminSubjects;
