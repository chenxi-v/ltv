'use client';

import React from 'react';

interface AnimatedCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedCardGrid({
  children,
  className = '',
}: AnimatedCardGridProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="inline-block"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
