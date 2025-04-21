'use client';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay = ({ message }: ErrorDisplayProps) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md flex items-center justify-center">
      <svg 
        className="w-6 h-6 mr-3 text-red-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
