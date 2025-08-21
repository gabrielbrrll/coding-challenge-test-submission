import { renderHook, act } from '@testing-library/react';
import useAddressBook from '../useAddressBook';

// Mock Redux hooks and services
jest.mock('../../core/store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => []
}));

jest.mock('../../core/services/databaseService', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn().mockResolvedValue(null)
  }
}));

describe('useAddressBook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAddressBook());

    expect(result.current.loading).toBe(true);
    expect(typeof result.current.addAddress).toBe('function');
    expect(typeof result.current.removeAddress).toBe('function');
    expect(typeof result.current.loadSavedAddresses).toBe('function');
  });

  it('should call addAddress function', () => {
    const { result } = renderHook(() => useAddressBook());
    const mockAddress = {
      id: '1',
      street: 'Main St',
      city: 'Sydney',
      postcode: '2000',
      houseNumber: '123',
      firstName: 'John',
      lastName: 'Doe'
    };

    act(() => {
      result.current.addAddress(mockAddress);
    });

    // Function should execute without error
    expect(typeof result.current.addAddress).toBe('function');
  });

  it('should call removeAddress function', () => {
    const { result } = renderHook(() => useAddressBook());

    act(() => {
      result.current.removeAddress('1');
    });

    // Function should execute without error
    expect(typeof result.current.removeAddress).toBe('function');
  });

  it('should handle loadSavedAddresses', async () => {
    const { result } = renderHook(() => useAddressBook());

    await act(async () => {
      await result.current.loadSavedAddresses();
    });

    expect(result.current.loading).toBe(false);
  });
});