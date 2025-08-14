import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TabMonitoringOptions {
  enabled: boolean;
  maxViolations: number;
  onViolation: () => void;
  onMaxViolationsReached: () => void;
}

interface TabMonitoringState {
  violations: number;
  isVisible: boolean;
  isFocused: boolean;
  isBlocked: boolean;
}

export const useTabMonitoring = ({
  enabled = false,
  maxViolations = 3,
  onViolation,
  onMaxViolationsReached
}: TabMonitoringOptions) => {
  const { toast } = useToast();
  const [state, setState] = useState<TabMonitoringState>({
    violations: 0,
    isVisible: true,
    isFocused: true,
    isBlocked: false
  });

  const lastVisibilityChange = useRef<number>(0);
  const initialLoad = useRef<boolean>(true);

  const handleViolation = useCallback(() => {
    setState(prev => {
      const newViolations = prev.violations + 1;
      const isBlocked = newViolations >= maxViolations;
      
      if (isBlocked) {
        toast({
          title: "Quiz Terminated",
          description: "Too many tab switches detected. Your quiz has been ended.",
          variant: "destructive",
        });
        onMaxViolationsReached();
      } else {
        const remainingWarnings = maxViolations - newViolations;
        toast({
          title: "Tab Switch Detected",
          description: `Warning ${newViolations}/${maxViolations}: Please stay on this tab. ${remainingWarnings} warning(s) remaining.`,
          variant: "destructive",
        });
        onViolation();
      }

      return {
        ...prev,
        violations: newViolations,
        isBlocked
      };
    });
  }, [maxViolations, onViolation, onMaxViolationsReached, toast]);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      const now = Date.now();
      const isVisible = !document.hidden;
      
      setState(prev => ({ ...prev, isVisible }));

      // Skip the initial load and rapid successive changes
      if (initialLoad.current) {
        initialLoad.current = false;
        return;
      }

      if (now - lastVisibilityChange.current < 500) return;
      lastVisibilityChange.current = now;

      // Tab became hidden (user switched away)
      if (!isVisible) {
        handleViolation();
      }
    };

    const handleWindowFocus = () => {
      setState(prev => ({ ...prev, isFocused: true }));
    };

    const handleWindowBlur = () => {
      const now = Date.now();
      setState(prev => ({ ...prev, isFocused: false }));

      // Skip the initial load and rapid successive changes
      if (initialLoad.current) {
        initialLoad.current = false;
        return;
      }

      if (now - lastVisibilityChange.current < 500) return;
      lastVisibilityChange.current = now;

      handleViolation();
    };

    // Prevent certain keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Alt+Tab, Ctrl+Tab, Ctrl+W, Ctrl+T, F11, etc.
      if (
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.key === 'Tab') ||
        (e.ctrlKey && (e.key === 'w' || e.key === 'W')) ||
        (e.ctrlKey && (e.key === 't' || e.key === 'T')) ||
        e.key === 'F11'
      ) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Keyboard shortcuts are disabled during the quiz.",
          variant: "destructive",
        });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleViolation, toast]);

  // Show fullscreen prompt for better quiz experience
  const requestFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Silently handle fullscreen errors
      });
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // Silently handle exit fullscreen errors  
      });
    }
  }, []);

  return {
    ...state,
    requestFullscreen,
    exitFullscreen,
    reset: () => setState(prev => ({ ...prev, violations: 0, isBlocked: false }))
  };
};