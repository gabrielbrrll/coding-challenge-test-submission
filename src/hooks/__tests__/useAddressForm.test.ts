import { renderHook, act } from '@testing-library/react';
import { useAddressForm } from '../useAddressForm';

describe('useAddressForm', () => {
  const mockOnAddressSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty form fields', () => {
    const { result } = renderHook(() => useAddressForm(mockOnAddressSearch));

    expect(result.current.addressFormFields.values).toEqual({
      postCode: '',
      houseNumber: ''
    });
    expect(result.current.error).toBeUndefined();
  });

  it('should handle form submission with valid data', async () => {
    const { result } = renderHook(() => useAddressForm(mockOnAddressSearch));

    // Set form values
    act(() => {
      result.current.addressFormFields.setFieldValue('postCode', '2000');
      result.current.addressFormFields.setFieldValue('houseNumber', '123');
    });

    // Submit form
    await act(async () => {
      const mockEvent = { preventDefault: jest.fn() } as any;
      await result.current.handleAddressSubmit(mockEvent);
    });

    expect(mockOnAddressSearch).toHaveBeenCalledWith('2000', '123');
    expect(result.current.error).toBeUndefined();
  });

  it('should handle validation errors', async () => {
    const { result } = renderHook(() => useAddressForm(mockOnAddressSearch));

    // Submit form with empty values
    await act(async () => {
      const mockEvent = { preventDefault: jest.fn() } as any;
      await result.current.handleAddressSubmit(mockEvent);
    });

    expect(result.current.error).toBe('Post code and house number are required!');
    expect(mockOnAddressSearch).not.toHaveBeenCalled();
  });

  it('should clear form and error', () => {
    const { result } = renderHook(() => useAddressForm(mockOnAddressSearch));

    // Set some values and error
    act(() => {
      result.current.addressFormFields.setFieldValue('postCode', '2000');
      result.current.setError('Test error');
    });

    // Clear form
    act(() => {
      result.current.clearAddressForm();
    });

    expect(result.current.addressFormFields.values).toEqual({
      postCode: '',
      houseNumber: ''
    });
    expect(result.current.error).toBeUndefined();
  });
});