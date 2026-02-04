import React, { useState } from 'react';

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Rating = ({
  value = 0,
  onChange,
  readOnly = true,
  size = 'md',
  showLabel = true,
  className = '',
  ...props
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeStyles = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const currentValue = hoverValue || value;

  const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className={`
              ${sizeStyles[size]}
              transition-transform duration-200
              ${!readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}
            `}
          >
            <svg
              className={`w-full h-full ${
                star <= currentValue
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-300 text-gray-300'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>

      {showLabel && currentValue > 0 && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {labels[currentValue - 1]}
        </span>
      )}
    </div>
  );
};
