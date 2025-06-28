
// Service worker registration and management
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              console.log('New content available');
              showUpdateNotification();
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('Service Worker unregistered');
      }
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
};

const showUpdateNotification = () => {
  // You could integrate this with your toast system
  if (window.confirm('New content is available. Reload to update?')) {
    window.location.reload();
  }
};

// Listen for service worker messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'SYNC_PENDING_DATA') {
      // Handle sync request from service worker
      console.log('Sync request received from service worker');
      // This would trigger your sync logic
    }
  });
}
