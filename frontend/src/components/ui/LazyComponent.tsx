'use client';

import React, { useEffect, useState, useRef } from 'react';

interface LazyComponentProps {
  children: React.ReactNode;
  threshold?: number;
  placeholder?: React.ReactNode;
  className?: string;
  onVisible?: () => void;
}

/**
 * LazyComponent - A component that renders its children only when it becomes visible in the viewport
 * 
 * @param children - The content to render when visible
 * @param threshold - The percentage of the component that needs to be visible to trigger loading (0-1)
 * @param placeholder - Content to show while the component is not yet visible
 * @param className - Additional CSS classes
 * @param onVisible - Callback function that is called when the component becomes visible
 */
const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  threshold = 0.1,
  placeholder = null,
  className = '',
  onVisible,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip if already visible or if running on the server
    if (hasBeenVisible || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          
          if (onVisible) {
            onVisible();
          }
          
          // Disconnect the observer once the component is visible
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasBeenVisible, onVisible, threshold]);

  // If we're on the server or the component has never been visible, show the placeholder
  if (!isVisible) {
    return (
      <div ref={ref} className={className}>
        {placeholder || (
          <div className="animate-pulse bg-gray-200 rounded-md w-full h-full min-h-[100px]" />
        )}
      </div>
    );
  }

  // If the component is visible, show the children
  return <div className={className}>{children}</div>;
};

export default LazyComponent;
