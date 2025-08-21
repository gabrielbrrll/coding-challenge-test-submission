import { renderHook, act } from '@testing-library/react';
import { useAddressSearch } from '../useAddressSearch';
import * as addressService from '../../services/addressService';

jest.mock('../../services/addressService');
const mockSearchAddresses = jest.mocked(addressService.searchAddresses);

describe('useAddressSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAddressSearch());

    expect(result.current.addresses).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.selectedAddress).toBe('');
  });

  it('should handle successful address search', async () => {
    const mockAddresses = [
      { id: '1', street: 'Main St', city: 'Sydney', postcode: '2000', houseNumber: '123', firstName: '', lastName: '' }
    ];
    
    mockSearchAddresses.mockResolvedValueOnce({
      status: 'ok',
      addresses: mockAddresses
    });

    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddresses('2000', '123');
    });

    expect(result.current.addresses).toEqual(mockAddresses);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle search errors', async () => {
    mockSearchAddresses.mockResolvedValueOnce({
      status: 'error',
      error: 'No addresses found'
    });

    const { result } = renderHook(() => useAddressSearch());

    await act(async () => {
      await result.current.searchAddresses('2000', '123');
    });

    expect(result.current.addresses).toEqual([]);
    expect(result.current.error).toBe('No addresses found');
    expect(result.current.loading).toBe(false);
  });

  it('should handle address selection', () => {
    const { result } = renderHook(() => useAddressSearch());

    act(() => {
      const event = { target: { value: 'address-123' } } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleSelectedAddressChange(event);
    });

    expect(result.current.selectedAddress).toBe('address-123');
  });

  it('should clear results', () => {
    const { result } = renderHook(() => useAddressSearch());

    act(() => {
      result.current.clearResults();
    });

    expect(result.current.addresses).toEqual([]);
    expect(result.current.selectedAddress).toBe('');
    expect(result.current.error).toBeUndefined();
  });
});