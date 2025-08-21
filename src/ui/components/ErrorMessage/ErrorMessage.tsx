import React, { FunctionComponent } from 'react';
import $ from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
  children?: React.ReactNode;
  id?: string;
  role?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ 
  message, 
  children, 
  id,
  role,
  'aria-live': ariaLive
}) => {
  if (!message && !children) return null;

  return (
    <div 
      className={$.errorMessage}
      id={id}
      role={role}
      aria-live={ariaLive}
    >
      <span className={$.errorIcon} aria-hidden="true">⚠️</span>
      {message || children}
    </div>
  );
};

export default ErrorMessage;