'use client';

// Check if browser notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show a notification
export const showNotification = (
  title: string,
  options?: NotificationOptions
): boolean => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const notification = new Notification(title, options);
  
  // Add click handler to focus the window and navigate to messages
  notification.onclick = () => {
    window.focus();
    if (options?.data?.url) {
      window.location.href = options.data.url;
    }
  };

  return true;
};

// Play notification sound
export const playNotificationSound = (): void => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play();
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};
