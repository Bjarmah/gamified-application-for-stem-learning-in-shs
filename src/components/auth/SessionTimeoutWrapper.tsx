import React from 'react';
import { useSessionTimeout } from '@/hooks/use-session-timeout';

interface SessionTimeoutWrapperProps {
  children: React.ReactNode;
}

const SessionTimeoutWrapper: React.FC<SessionTimeoutWrapperProps> = ({ children }) => {
  // Initialize session timeout with 30 minutes timeout and 5 minutes warning
  useSessionTimeout({ 
    timeoutMinutes: 30, 
    warningMinutes: 5 
  });

  return <>{children}</>;
};

export default SessionTimeoutWrapper;