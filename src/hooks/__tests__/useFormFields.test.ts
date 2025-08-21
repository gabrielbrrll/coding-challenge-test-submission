import { renderHook, act } from '@testing-library/react';
import { useFormFields } from '../useFormFields';

describe('useFormFields', () => {
  const initialValues = { name: 'John', email: 'john@test.com' };

  it('should initialize with provided values', () => {
    const { result } = renderHook(() => useFormFields(initialValues));
    expect(result.current.values).toEqual(initialValues);
  });

  it('should handle field changes', () => {
    const { result } = renderHook(() => useFormFields(initialValues));

    act(() => {
      const event = { target: { name: 'name', value: 'Jane' } } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    expect(result.current.values.name).toBe('Jane');
  });

  it('should reset fields', () => {
    const { result } = renderHook(() => useFormFields(initialValues));

    act(() => {
      result.current.setFieldValue('name', 'Changed');
    });
    
    act(() => {
      result.current.resetFields();
    });

    expect(result.current.values).toEqual(initialValues);
  });
});