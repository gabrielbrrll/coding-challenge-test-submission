import { renderHook, act } from '@testing-library/react';
import { usePersonForm } from '../usePersonForm';

// Mock Redux hooks
jest.mock('../../core/store/hooks', () => ({
  useAppSelector: jest.fn(() => [])
}));

jest.mock('../useAddressBook', () => ({
  __esModule: true,
  default: () => ({
    addAddress: jest.fn()
  })
}));

// Mock the validation function
jest.mock('../../core/reducers/addressBookSlice', () => ({
  ...jest.requireActual('../../core/reducers/addressBookSlice'),
  validateAddressForDuplicates: jest.fn(() => ({ isDuplicate: false }))
}));

describe('usePersonForm', () => {
  const mockAddresses = [
    { id: '1', street: 'Main St', city: 'Sydney', postcode: '2000', houseNumber: '123', firstName: '', lastName: '' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty form fields', () => {
    const { result } = renderHook(() => usePersonForm('1', mockAddresses));

    expect(result.current.personFormFields.values).toEqual({
      firstName: '',
      lastName: ''
    });
    expect(result.current.error).toBeUndefined();
  });

  it('should handle form submission with valid data', () => {
    const { result } = renderHook(() => usePersonForm('1', mockAddresses));

    // Set form values
    act(() => {
      result.current.personFormFields.setFieldValue('firstName', 'John');
      result.current.personFormFields.setFieldValue('lastName', 'Doe');
    });

    // Submit form
    act(() => {
      const mockEvent = { preventDefault: jest.fn() } as any;
      result.current.handlePersonSubmit(mockEvent);
    });

    expect(result.current.error).toBeUndefined();
  });

  it('should handle validation errors for empty fields', () => {
    const { result } = renderHook(() => usePersonForm('1', mockAddresses));

    // Submit form with empty values
    act(() => {
      const mockEvent = { preventDefault: jest.fn() } as any;
      result.current.handlePersonSubmit(mockEvent);
    });

    expect(result.current.error).toBe('First name and last name fields mandatory!');
  });

  it('should handle no selected address error', () => {
    const { result } = renderHook(() => usePersonForm('', mockAddresses));

    // Set form values
    act(() => {
      result.current.personFormFields.setFieldValue('firstName', 'John');
      result.current.personFormFields.setFieldValue('lastName', 'Doe');
    });

    // Submit form
    act(() => {
      const mockEvent = { preventDefault: jest.fn() } as any;
      result.current.handlePersonSubmit(mockEvent);
    });

    expect(result.current.error).toBe('No address selected, try to select an address or find one if you haven\'t');
  });

  it('should clear form and error', () => {
    const { result } = renderHook(() => usePersonForm('1', mockAddresses));

    // Set some values and error
    act(() => {
      result.current.personFormFields.setFieldValue('firstName', 'John');
      result.current.setError('Test error');
    });

    // Clear form
    act(() => {
      result.current.clearPersonForm();
    });

    expect(result.current.personFormFields.values).toEqual({
      firstName: '',
      lastName: ''
    });
    expect(result.current.error).toBeUndefined();
  });
});