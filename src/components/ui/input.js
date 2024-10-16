import React from 'react';

export function Input({ type = 'text', value, onChange, className, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
  );
}
