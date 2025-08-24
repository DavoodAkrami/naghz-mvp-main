import React from 'react';

interface ButtonLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'secondary';
  className?: string;
}

const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  size = 'md',
  color = 'white',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin`}
      />
    </div>
  );
};

export default ButtonLoading;
