// src/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "filled"; // You can customize the button types
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, variant = "filled" }) => {
  const buttonClass = variant === "outline"
    ? `border-2 border-gray-700 text-gray-700 hover:bg-gray-200 p-2 rounded-lg ${className}`
    : `bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-lg ${className}`;

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;
