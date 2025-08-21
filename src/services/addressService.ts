import generateMockAddresses from '../utils/generateMockAddresses';
import transformAddress, { RawAddressModel } from '../core/models/address';
import { Address } from '../types';

export interface RawAddress {
  city: string;
  houseNumber: string;
  postcode: string;
  street: string;
  lat: string;
  lon: string;
}

export interface AddressSearchResult {
  status: 'ok' | 'error';
  addresses?: Address[];
  error?: string;
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
 * Searches for addresses using the API endpoint and returns transformed results
 */
export const searchAddresses = async (postCode: string, houseNumber: string): Promise<AddressSearchResult> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const url = `${baseUrl}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        error: data.errormessage || 'Failed to fetch addresses'
      };
    }

    if (data.status === 'ok' && data.details) {
      const transformedAddresses = data.details.map((rawAddress: RawAddressModel) => {
        return transformAddress(rawAddress);
      });
      
      return {
        status: 'ok',
        addresses: transformedAddresses
      };
    } else {
      return {
        status: 'error',
        error: data.errormessage || 'No addresses found'
      };
    }
  } catch (err) {
    return {
      status: 'error',
      error: 'Network error occurred while fetching addresses'
    };
  }
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
   * Searches for addresses by postcode and street number (legacy method)
   */
  static async searchAddresses(postcode: string, streetnumber: string): Promise<RawAddress[] | null> {
    return findAddresses(postcode, streetnumber);
  }
  
  /**
   * Searches for addresses and returns transformed results
   */
  static async searchTransformedAddresses(postCode: string, houseNumber: string): Promise<AddressSearchResult> {
    return searchAddresses(postCode, houseNumber);
  }
  
  // Future methods can be added here:
  // static async saveAddress(address: RawAddress): Promise<boolean>
  // static async deleteAddress(id: string): Promise<boolean>
}