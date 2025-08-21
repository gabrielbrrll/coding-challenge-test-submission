import React, { FunctionComponent } from 'react';
import { FormProps } from '@/types';

import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import $ from './Form.module.css';

interface ExtendedFormProps extends FormProps {
  errorId?: string;
}

const Form: FunctionComponent<ExtendedFormProps> = ({
  label,
  loading = false,
  formEntries,
  onFormSubmit,
  submitText,
  error,
  clearButton,
  errorId
}) => {
  return (
    <form onSubmit={onFormSubmit} className={$.form} noValidate>
      <fieldset className={$.fieldset}>
        <legend className={$.legend}>{label}</legend>
        
        <div className={$.formFields}>
          {formEntries.map(({ name, placeholder, extraProps }, index) => (
            <div key={`${name}-${index}`} className={$.formRow}>
              <InputText
                name={name}
                placeholder={placeholder}
                {...extraProps}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className={$.errorContainer}>
            <ErrorMessage 
              message={error} 
              id={errorId}
              role="alert"
              aria-live="polite"
            />
          </div>
        )}

        <div className={$.buttonGroup}>
          <Button 
            loading={loading} 
            type="submit"
            variant="primary"
            disabled={loading}
            aria-describedby={error ? errorId : undefined}
          >
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
