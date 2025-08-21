import React, { FunctionComponent } from 'react';
import { FormProps } from '@/types';

import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import $ from './Form.module.css';

const Form: FunctionComponent<FormProps> = ({
  label,
  loading = false,
  formEntries,
  onFormSubmit,
  submitText,
  error,
  clearButton
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}`} className={$.formRow}>
            <InputText
              name={name}
              placeholder={placeholder}
              {...extraProps}
            />
          </div>
        ))}

        {error && <ErrorMessage message={error} />}

        <div className={$.buttonGroup}>
          <Button loading={loading} type="submit">
            {submitText}
          </Button>
          
          {clearButton && (
            <Button 
              variant="secondary" 
              type="button"
              onClick={clearButton.onClick}
            >
              {clearButton.text}
            </Button>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default Form;
