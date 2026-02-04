import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: string | number;
  width?: string | number;
  circle?: boolean;
}

export const Skeleton = ({
  count = 1,
  height = '1rem',
  width = '100%',
  circle = false,
  className = '',
  ...props
}: SkeletonProps) => {
  const skeletons = Array.from({ length: count });

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={`
            bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
            dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
            animate-pulse mb-3
            ${circle ? 'rounded-full' : 'rounded-lg'}
            ${className}
          `}
          style={{
            height: heightStyle,
            width: widthStyle,
          }}
          {...props}
        />
      ))}
    </>
  );
};
