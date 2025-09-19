import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    Plus,
    Users,
    BarChart3,
    Settings,
    Shield,
    Database,
    Activity
} from 'lucide-react';

const AdminDashboard = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();

    // Check if user is admin
    if (!profile || profile.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-12">
                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                        <p className="text-muted-foreground mb-4">
                            You don't have permission to access the admin panel.
                        </p>
                        <Button onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage content, users, and system settings
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">
                            +3 new this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5,678</div>
                        <p className="text-xs text-muted-foreground">
                            +23% from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Healthy</div>
                        <p className="text-xs text-muted-foreground">
                            All systems operational
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="content" className="w-full">
                <TabsList>
                    <TabsTrigger value="content">Content Management</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">System Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate('/admin/subjects')}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Subjects
                                </CardTitle>
                                <CardDescription>
                                    Manage subjects and their modules
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">12 subjects</Badge>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate('/admin/modules')}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Modules
                                </CardTitle>
                                <CardDescription>
                                    Create and edit learning modules
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">89 modules</Badge>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate('/admin/quizzes')}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Quizzes
                                </CardTitle>
                                <CardDescription>
                                    Manage quizzes and assessments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">156 quizzes</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>
                                View and manage user accounts and roles
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Total Users</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">1,247</div>
                                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Active Sessions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">89</div>
                                            <p className="text-xs text-muted-foreground">Currently online</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">New Registrations</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">23</div>
                                            <p className="text-xs text-muted-foreground">This week</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="font-medium">Recent Users</h4>
                                    <div className="space-y-2">
                                        {[
                                            { name: 'John Doe', email: 'john@example.com', joined: '2 hours ago', status: 'active' },
                                            { name: 'Jane Smith', email: 'jane@example.com', joined: '1 day ago', status: 'inactive' },
                                            { name: 'Mike Johnson', email: 'mike@example.com', joined: '3 days ago', status: 'active' }
                                        ].map((user, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                                                <div>
                                                    <div className="font-medium text-sm">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                                        {user.status}
                                                    </Badge>
                                                    <div className="text-xs text-muted-foreground">{user.joined}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Export Users</Button>
                                    <Button variant="outline" size="sm">Send Announcement</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics Dashboard</CardTitle>
                            <CardDescription>
                                View detailed analytics and reports
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Daily Active Users</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">456</div>
                                            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Avg. Session Time</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">24m</div>
                                            <p className="text-xs text-muted-foreground">+3m from last week</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Course Completions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">89</div>
                                            <p className="text-xs text-muted-foreground">This week</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Quiz Success Rate</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">73%</div>
                                            <p className="text-xs text-muted-foreground">+5% improvement</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">Popular Subjects</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {[
                                                    { subject: 'Mathematics', users: 342, percentage: 85 },
                                                    { subject: 'Physics', users: 298, percentage: 72 },
                                                    { subject: 'Chemistry', users: 256, percentage: 62 },
                                                    { subject: 'Biology', users: 189, percentage: 45 }
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm">{item.subject}</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 bg-muted rounded-full h-2">
                                                                <div 
                                                                    className="bg-primary h-2 rounded-full" 
                                                                    style={{ width: `${item.percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{item.users}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">Learning Progress</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Beginner</span>
                                                    <span className="text-sm font-medium">45%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Intermediate</span>
                                                    <span className="text-sm font-medium">32%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Advanced</span>
                                                    <span className="text-sm font-medium">23%</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                            <CardDescription>
                                Configure system-wide settings and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">Platform Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Maintenance Mode</span>
                                                <Badge variant="outline">Disabled</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Registration</span>
                                                <Badge variant="default">Open</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">AI Features</span>
                                                <Badge variant="default">Enabled</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Notifications</span>
                                                <Badge variant="default">Active</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">System Status</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Database</span>
                                                <Badge variant="default">Healthy</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">API Response</span>
                                                <Badge variant="default">145ms avg</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Storage Usage</span>
                                                <Badge variant="secondary">67%</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Uptime</span>
                                                <Badge variant="default">99.9%</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="font-medium">Quick Actions</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <Button variant="outline" size="sm">Clear Cache</Button>
                                        <Button variant="outline" size="sm">Backup Data</Button>
                                        <Button variant="outline" size="sm">Update Content</Button>
                                        <Button variant="outline" size="sm">System Health</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
