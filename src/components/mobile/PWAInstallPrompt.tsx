import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Share } from 'lucide-react';
import { useMobileUtils } from '@/hooks/use-mobile-utils';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { isMobile, isStandalone, addToHomeScreen } = useMobileUtils();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt for iOS users who haven't installed
    if (isMobile && !isStandalone) {
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile, isStandalone]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
  };

  const iosInstructions = addToHomeScreen();

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-fade-in">
      <Card className="shadow-lg border-2 border-stemPurple/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-stemPurple" />
              <CardTitle className="text-base">Install STEM Stars</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-sm">
            {iosInstructions.isIOS 
              ? "Add to your home screen for the best experience!"
              : "Install the app for faster access and offline features."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {iosInstructions.isIOS ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Share className="h-4 w-4" />
                <span>Tap the share button, then "Add to Home Screen"</span>
              </div>
              <Button
                onClick={handleDismiss}
                className="w-full bg-stemPurple hover:bg-stemPurple/90"
              >
                Got it!
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-stemPurple hover:bg-stemPurple/90"
              >
                Install App
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="px-3"
              >
                Not now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}