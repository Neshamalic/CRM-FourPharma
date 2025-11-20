import React from 'react';
import Icon from '../AppIcon';

const LoadingOverlay = ({ 
  isLoading = false, 
  message = 'Loading...', 
  overlay = true,
  size = 'default' 
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-3">
      <div className={`${sizeClasses?.[size]} animate-spin`}>
        <Icon name="Loader2" size={size === 'sm' ? 16 : size === 'lg' ? 32 : 24} className="text-primary" />
      </div>
      {message && (
        <span className="text-text-secondary font-medium">{message}</span>
      )}
    </div>
  );

  if (!overlay) {
    return <LoadingSpinner />;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-background bg-opacity-75 backdrop-blur-sm">
      <div className="bg-surface p-6 rounded-lg clinical-shadow-lg">
        <LoadingSpinner />
      </div>
    </div>
  );
};

// Skeleton components for content loading states
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-surface p-6 rounded-lg clinical-shadow animate-pulse ${className}`}>
    <div className="space-y-4">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-surface rounded-lg clinical-shadow overflow-hidden ${className}`}>
    <div className="p-4 border-b border-border">
      <div className="flex space-x-4">
        {Array.from({ length: columns })?.map((_, index) => (
          <div key={index} className="h-4 bg-muted rounded flex-1 animate-pulse"></div>
        ))}
      </div>
    </div>
    <div className="divide-y divide-border">
      {Array.from({ length: rows })?.map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns })?.map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-muted rounded flex-1 animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items })?.map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 bg-surface rounded-lg clinical-shadow animate-pulse">
        <div className="w-10 h-10 bg-muted rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingOverlay;