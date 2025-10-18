import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      // Wait for the fade-out animation to complete before unmounting the component
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // This duration should match the fade-out animation duration in CSS
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isVisible) {
    return null;
  }

  const animationClass = isLoading ? 'animate-fade-in' : 'animate-fade-out';

  return (
    <div
      className={`fixed inset-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[9999] ${animationClass}`}
      aria-live="assertive"
      role="status"
    >
      <div className="spinner" aria-label="Loading page"></div>
    </div>
  );
};

export default LoadingOverlay;
