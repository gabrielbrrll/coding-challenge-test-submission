import React, { FunctionComponent } from 'react';

import $ from './Radio.module.css';

interface RadioProps {
  id: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
}

const Radio: FunctionComponent<RadioProps> = ({ 
  children, 
  id, 
  name, 
  onChange, 
  checked = false,
  disabled = false
}) => {
  return (
    <div className={`${$.radio} ${checked ? $.radioChecked : ''} ${disabled ? $.radioDisabled : ''}`}>
      <input 
        type="radio" 
        id={id} 
        name={name} 
        onChange={onChange} 
        value={id}
        checked={checked}
        disabled={disabled}
        className={$.radioInput}
        aria-describedby={`${id}-content`}
      />
      <label htmlFor={id} className={$.radioLabel}>
        <div className={$.radioIndicator}>
          <div className={$.radioInner}></div>
        </div>
        <div className={$.radioContent} id={`${id}-content`}>
          {children}
        </div>
      </label>
    </div>
  );
};

export default Radio;
