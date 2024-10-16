import React from 'react';

export function ScrollArea({ children, className }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
