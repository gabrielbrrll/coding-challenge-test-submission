import React, { FunctionComponent } from 'react';
import $ from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
  children?: React.ReactNode;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message, children }) => {
  if (!message && !children) return null;

  return (
    <div className={$.errorMessage}>
      {message || children}
    </div>
  );
};

export default ErrorMessage;