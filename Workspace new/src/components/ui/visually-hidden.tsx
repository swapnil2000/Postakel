import React from 'react';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function VisuallyHidden({ children, ...props }: VisuallyHiddenProps) {
  return (
    <div
      {...props}
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      {children}
    </div>
  );
}