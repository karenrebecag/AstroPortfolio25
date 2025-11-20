import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'readmore';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const buttonVariants = {
  default: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
  ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
  outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
  secondary: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
  readmore: "bg-gradient-to-r from-[#4523AE] to-[#6B46C1] text-white font-mono uppercase text-[10px] px-3 py-2 rounded-[20px] shadow-lg shadow-[#4523AE]/50 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:from-[#5a34c2] hover:to-[#7e57d4]"
};

const buttonSizes = {
  sm: "h-7 px-2 text-xs",
  default: "h-9 px-4 py-2 text-sm",
  lg: "h-11 px-8 text-base"
};

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children,
  ...props 
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
