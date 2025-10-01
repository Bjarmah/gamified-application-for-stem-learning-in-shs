import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ContentManager } from '@/components/admin/ContentManager';
import { Loader2 } from 'lucide-react';

const ContentManagement: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ContentManager />
    </div>
  );
};

export default ContentManagement;
