import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';
type NotificationPermission = 'granted' | 'denied' | 'default';

interface ToastState {
  message: string;
  type: ToastType;
  id: number; // To handle rapid calls
}

interface NotificationContextType {
  toast: ToastState | null;
  showToast: (message: string, type?: ToastType) => void;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => void;
  sendPushNotification: (title: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check initial notification permission status if API is available
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      showToast('This browser does not support desktop notifications.', 'error');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      showToast('Notifications enabled!', 'success');
      sendPushNotification('AquaVolt Notifications Enabled', { body: 'You will now receive important updates.' });
    } else if (permission === 'denied') {
      showToast('Notifications have been blocked. You can enable them in your browser settings.', 'info');
    }
  }, [showToast]);

  const sendPushNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (notificationPermission !== 'granted') {
      console.log('Notification permission not granted. Cannot send notification.');
      return;
    }
    new Notification(title, {
      ...options,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACqUlEQVRoQ+2Z21XDMAxAk25CN+gGbAJgA2ACYoJwA2ADssImETYANoCbUDZgA2ACdoPaBCZPkyVp8iD5l3Tpvz/dIzeehG0SdybJkYAU8B3wLgE+AB8An98FPAfOASuAXK8LPAIWgUfAX+Bf595kL3AduAJ0h3S2vQK8Bf6fA78DPwa8l68eLq0L/Nsd8CwwKjQAzwDTwCNgK3BJYy20zO8Cn7Qd8ATYVlUBUwJ3gA7gOnAFlPqgFNga+ArgOvDXPOAGsCswTRcDs0An8DXwI0aBTuA+cNs2YAW4aRfgGfB3LwK/AT+AVcAUaAemgW9rAQlQ6Yq/M3mB5l2pEWADuN/LwA/goI+AS8DFwE6VlU2rA5sA79sBPAJuAm8DP1pHPkLgNvAw8DswStUFLAeeO/Ab8Am4CJwA3AE6QvW53QY2AVbUKsC/1bMA/gNWAWdASpUFLAx8b/ME+Ai8DLwBTgKnQEv/dIA7wLEaA78Ag8BPwBxgE3gKvMhJbIEPgW/AnYClBLgr8A74CVhNkfP/q1gLPAZeVgYmASOAbcBX4E1gbzJgYq8v24dJ4Lz8kH/uK3A14FNgn0LgU+BbYHVf5gW4AFwDngJf27zBAvAJGAxcAfYHngc+B+YBl7Rr+bYVOAmstvkGPgTeBxYBr7Rr+a4TOAysBNbL/AacBTYAvgDeB/bL/M4w0i+BlcDtgDfAvo3nAZPA0yB/gX/gM/AGeB/YL/MGWkK2/Q04DezT+Q0cAWcBN4Hvwb7N79yC/Tr/q2zfn0d56bA6sE/r3kGgVf9kAvQGfgf2bX4J/I++Dvwy8Dqwz+bXgZ/Bf2/+Cvx/DvwG/AOeAfeBjcA+A74Dvgf+B6k0n/+B/wA5n4rZ+dAtgQAAAABJRU5ErkJggg==', // AquaVolt icon
    });
  }, [notificationPermission]);
  
  return (
    <NotificationContext.Provider value={{ toast, showToast, notificationPermission, requestNotificationPermission, sendPushNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};