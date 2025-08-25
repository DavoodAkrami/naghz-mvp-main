import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface NaghzLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'header' | 'xl';
  className?: string;
  alt?: string;
}

const NaghzLogo: React.FC<NaghzLogoProps> = ({ 
  size = 'md', 
  className = '',
  alt = 'Naghz Logo'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    header: 'w-14 h-14',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const sizeValues = {
    sm: 32,
    md: 48,
    header: 56,
    lg: 64,
    xl: 96
  };

  return (
    <div className={clsx(sizeClasses[size], className)}>
      <Image
        src="/naghz-logo-nobg.png"
        alt={alt}
        width={sizeValues[size]}
        height={sizeValues[size]}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
};

export default NaghzLogo;
