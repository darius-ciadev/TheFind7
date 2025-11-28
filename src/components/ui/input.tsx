// components/ui/Input.tsx

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input {...props} />
    </div>
  );
};

export default Input;