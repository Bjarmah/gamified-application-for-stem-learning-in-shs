import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a2b32676e3b34f9ab6fe3f303a0e8b5b',
  appName: 'gamified-application-for-stem-learning-in-shs',
  webDir: 'dist',
  server: {
    url: 'https://a2b32676-e3b3-4f9a-b6fe-3f303a0e8b5b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;