import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SessionTimeoutConfig {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export const useSessionTimeout = ({ 
  timeoutMinutes = 30, 
  warningMinutes = 5 
}: SessionTimeoutConfig = {}) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    if (!user) return;

    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Set warning timer
    warningRef.current = setTimeout(() => {
      toast({
        title: "Session Warning",
        description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
        variant: "destructive",
      });
    }, (timeoutMinutes - warningMinutes) * 60 * 1000);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive",
      });
      signOut();
    }, timeoutMinutes * 60 * 1000);
  }, [user, timeoutMinutes, warningMinutes, signOut, toast]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only reset if it's been more than 1 minute since last reset
    if (timeSinceLastActivity > 60000) {
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    if (!user) {
      // Clear timers when user logs out
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      return;
    }

    // Start the timer
    resetTimer();

    // Activity event listeners
    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user, resetTimer, handleActivity]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current
  };
};