import { findAddresses, AddressService } from '../addressService';
import generateMockAddresses from '../../utils/generateMockAddresses';

// Mock the generateMockAddresses utility
jest.mock('../../utils/generateMockAddresses');
const mockedGenerateMockAddresses = generateMockAddresses as jest.MockedFunction<typeof generateMockAddresses>;

// Mock setTimeout to avoid actual delays in tests
jest.useFakeTimers();

describe('addressService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('findAddresses', () => {
    it('should return addresses when mock data is available', async () => {
      const mockAddresses = [
        {
          city: 'Sydney',
          houseNumber: '2',
          postcode: '2133',
          street: '2 Edward Street',
          lat: '0.123',
          lon: '0.456'
        }
      ];

      mockedGenerateMockAddresses.mockReturnValue(mockAddresses);

      const promise = findAddresses('2133', '2');
      
      // Fast forward the 500ms delay
      jest.advanceTimersByTime(500);
      
      const result = await promise;
      
      expect(result).toEqual(mockAddresses);
      expect(mockedGenerateMockAddresses).toHaveBeenCalledWith('2133', '2');
    });

    it('should return null when no addresses are found', async () => {
      mockedGenerateMockAddresses.mockReturnValue(null);

      const promise = findAddresses('9999', '999');
      
      // Fast forward the potential delay (though it shouldn't delay for null results)
      jest.advanceTimersByTime(500);
      
      const result = await promise;
      
      expect(result).toBeNull();
      expect(mockedGenerateMockAddresses).toHaveBeenCalledWith('9999', '999');
    });
  });

  describe('AddressService.searchAddresses', () => {
    it('should delegate to findAddresses function', async () => {
      const mockAddresses = [
        {
          city: 'Melbourne',
          houseNumber: '3',
          postcode: '3000',
          street: '3 Collins Street',
          lat: '0.789',
          lon: '0.101'
        }
      ];

      mockedGenerateMockAddresses.mockReturnValue(mockAddresses);

      const promise = AddressService.searchAddresses('3000', '3');
      
      // Fast forward the 500ms delay
      jest.advanceTimersByTime(500);
      
      const result = await promise;
      
      expect(result).toEqual(mockAddresses);
    });
  });
});