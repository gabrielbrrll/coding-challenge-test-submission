import { ButtonProps } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  return (
    <button
      className={`${$.button} ${variant === 'primary' ? $.primary : ''} ${variant === 'secondary' ? $.secondary : ''}`}
      type={type}
      onClick={onClick}
    >
      {loading && <span data-testid="loading-spinner">⏳</span>}
      {children}
    </button>
  );
};

export default Button;
