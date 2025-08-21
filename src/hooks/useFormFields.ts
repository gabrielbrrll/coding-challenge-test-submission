import { useState, useCallback } from 'react';

export type FormFieldValues<T extends Record<string, string>> = T;

export interface UseFormFieldsReturn<T extends Record<string, string>> {
  values: T;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetFields: () => void;
  setFieldValue: (name: keyof T, value: string) => void;
}

export function useFormFields<T extends Record<string, string>>(
  initialValues: T
): UseFormFieldsReturn<T> {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const resetFields = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setFieldValue = useCallback((name: keyof T, value: string) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return {
    values,
    handleChange,
    resetFields,
    setFieldValue
  };
}