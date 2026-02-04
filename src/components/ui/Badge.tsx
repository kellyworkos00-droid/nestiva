import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge = ({ variant = 'default', size = 'sm', className = '', children, ...props }: BadgeProps) => {
  const variantStyles = {
    default: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs font-medium rounded',
    md: 'px-3 py-1.5 text-sm font-medium rounded-md',
  };

  return (
    <div className={`inline-block ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </div>
  );
};
