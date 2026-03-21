import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-[10px]',
    md: 'px-8 py-3.5 text-[10px]',
    lg: 'px-12 py-5 text-xs font-black',
  };

  const baseClasses = "relative inline-flex items-center justify-center rounded-full transition-all duration-500 uppercase tracking-[0.25em] outline-none select-none overflow-hidden group font-black";
  
  const getVariantClasses = () => {
    if (disabled) return 'opacity-30 grayscale shadow-none cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
      case 'accent':
        return 'bg-nova-red text-white shadow-[0_8px_30px_rgba(157,10,0,0.2)] hover:shadow-nova-red/40 active:translate-y-[2px] active:shadow-none';
      case 'outline':
        return 'border border-black/10 text-nova-black hover:bg-nova-red hover:text-white hover:border-nova-red';
      default:
        return '';
    }
  };

  return (
    <motion.button
      whileHover={!disabled ? { 
        y: -3,
        transition: { type: "spring", stiffness: 400, damping: 20 } 
      } : {}}
      whileTap={!disabled ? { scale: 0.97, y: 0 } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${getVariantClasses()} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {!disabled && (variant === 'primary' || variant === 'accent') && (
        <motion.div 
          initial={{ left: '-100%' }}
          whileHover={{ left: '100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] z-0"
        />
      )}
    </motion.button>
  );
};

export default Button;