import generateMockAddresses from '../utils/generateMockAddresses';

export interface RawAddress {
  city: string;
  houseNumber: string;
  postcode: string;
  street: string;
  lat: string;
  lon: string;
}

/**
 * Creates a delay for the specified number of milliseconds
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Finds addresses based on postcode and street number
 * This function encapsulates the business logic for address searching
 */
export const findAddresses = async (postcode: string, streetnumber: string): Promise<RawAddress[] | null> => {
  // Generate mock addresses using the existing utility
  const mockAddresses = generateMockAddresses(postcode, streetnumber);
  
  if (mockAddresses) {
    // Add artificial delay for loading state demonstration
    // In a real application, this would be replaced with actual database/API calls
    await delay(500);
    
    return mockAddresses;
  }
  
  return null; // No addresses found
};

/**
 * Service layer for address-related operations
 * This can be expanded with additional address operations like:
 * - saveAddress
 * - updateAddress  
 * - deleteAddress
 * - validateAddress
 */
export class AddressService {
  /**
   * Searches for addresses by postcode and street number
   */
  static async searchAddresses(postcode: string, streetnumber: string): Promise<RawAddress[] | null> {
    return findAddresses(postcode, streetnumber);
  }
  
  // Future methods can be added here:
  // static async saveAddress(address: RawAddress): Promise<boolean>
  // static async deleteAddress(id: string): Promise<boolean>
}