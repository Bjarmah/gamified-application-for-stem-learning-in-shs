import { useState, useEffect } from 'react';

export function useMobileUtils() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(height > width ? 'portrait' : 'landscape');
      
      // Check if app is running in standalone mode (PWA)
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true);
    };

    checkDeviceType();

    const handleResize = () => {
      checkDeviceType();
    };

    const handleOrientationChange = () => {
      setTimeout(checkDeviceType, 100); // Small delay for orientation change
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const shareContent = async (shareData: ShareData) => {
    if ('share' in navigator) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.log('Error sharing:', error);
        return false;
      }
    }
    return false;
  };

  const installPWA = () => {
    // This would be connected to the beforeinstallprompt event
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        }
        (window as any).deferredPrompt = null;
      });
    }
  };

  const addToHomeScreen = () => {
    // For iOS Safari users
    if (!isStandalone && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      return {
        isIOS: true,
        message: 'To install this app, tap the share button and then "Add to Home Screen"'
      };
    }
    return { isIOS: false, message: '' };
  };

  const preventZoom = () => {
    // Prevent zoom on mobile devices for better UX
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport && isMobile) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
      );
    }
  };

  const allowZoom = () => {
    // Re-enable zoom
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
  };

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    orientation,
    isStandalone,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    vibrate,
    shareContent,
    installPWA,
    addToHomeScreen,
    preventZoom,
    allowZoom,
    deviceInfo: {
      isMobile,
      isTablet,
      orientation,
      isStandalone,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    }
  };
}