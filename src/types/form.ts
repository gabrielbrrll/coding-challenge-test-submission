import { InputHTMLAttributes } from 'react';

export type FormInputExtraProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'placeholder'> & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
};

export interface FormEntry {
  name: string;
  placeholder: string;
  extraProps: FormInputExtraProps;
}

export interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
}