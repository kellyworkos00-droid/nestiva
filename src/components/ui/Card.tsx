import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, bordered = true, className = '', children, ...props }, ref) => {
    const baseStyles =
      'rounded-2xl bg-white dark:bg-gray-900 shadow-sm transition-all duration-300';

    const hoverStyles = hoverable ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' : '';
    const borderStyles = bordered ? 'border border-gray-200 dark:border-gray-800' : '';

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${hoverStyles}
          ${borderStyles}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 border-b border-gray-200 dark:border-gray-800 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-800 ${className}`}>
    {children}
  </div>
);
