import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = 'text-blue-500',
  fullScreen = false,
  text = 'Carregando...',
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center animate-fadeIn">
      <div
        className={`${sizeClasses[size]} ${color} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
      {text && <p className={`mt-2 text-sm ${color} animate-pulse`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 animate-fadeIn">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;