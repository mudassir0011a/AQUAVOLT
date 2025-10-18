import React, { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
}

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade in
    const fadeInTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Trigger fade out
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [message, type, duration]);
  
  const typeConfig = {
    success: { icon: <SuccessIcon />, baseClass: 'bg-white dark:bg-slate-800 border-green-500' },
    // Can add error and info later if needed
  };
  
  const config = typeConfig[type] || typeConfig['success'];

  return (
    <div
      className={`fixed top-20 right-5 z-[10000] w-full max-w-sm p-4 rounded-lg shadow-2xl border-l-4 flex items-center gap-4 transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} ${config.baseClass}`}
      role="alert"
    >
      {config.icon}
      <p className="font-semibold text-slate-800 dark:text-slate-100">{message}</p>
    </div>
  );
};

export default Toast;