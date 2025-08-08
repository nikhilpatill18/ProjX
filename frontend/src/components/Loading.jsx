import React from 'react';

const LoadingComponent = ({ 
  message = "Loading...", 
  fullScreen = true,
  progress = null // Optional: pass a number 0-100 for progress
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        {/* Loading Text */}
        <p className="text-gray-400 text-sm font-medium">{message}</p>
        
        {/* Horizontal Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          {progress !== null ? (
            // Determinate progress bar
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          ) : (
            // Indeterminate progress bar
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-loading-bar"></div>
          )}
        </div>
        
        {/* Progress percentage (only if progress prop is provided) */}
        {progress !== null && (
          <p className="text-gray-500 text-xs">{Math.round(progress)}%</p>
        )}
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
            width: 30%;
          }
          50% {
            transform: translateX(0%);
            width: 30%;
          }
          100% {
            transform: translateX(300%);
            width: 30%;
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingComponent;