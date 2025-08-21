import { ButtonProps } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ExtendedButtonProps extends ButtonProps {
  disabled?: boolean;
  'aria-describedby'?: string;
  'aria-label'?: string;
  size?: 'small' | 'medium' | 'large';
}

const Button: FunctionComponent<ExtendedButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  size = 'medium',
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  ...props
}) => {
  const buttonClasses = [
    $.button,
    $.ripple,
    $[variant],
    $[size],
    loading ? $.loading : '',
    disabled ? $.disabled : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      {...props}
    >
      {loading && (
        <span className={$.loadingSpinner} aria-hidden="true"></span>
      )}
      <span className={loading ? $.buttonTextLoading : $.buttonText}>
        {children}
      </span>
    </button>
  );
};

export default Button;
