import { useState } from 'react';
import { Address } from '../types';
import { searchAddresses as searchAddressesService } from '../services/addressService';

interface UseAddressSearchReturn {
  addresses: Address[];
  loading: boolean;
  error: string | undefined;
  selectedAddress: string;
  searchAddresses: (postCode: string, houseNumber: string) => Promise<void>;
  clearResults: () => void;
  handleSelectedAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSelection: () => void;
}

export const useAddressSearch = (): UseAddressSearchReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedAddress, setSelectedAddress] = useState("");

  const searchAddresses = async (postCode: string, houseNumber: string) => {
    setError(undefined);
    setAddresses([]);
    setSelectedAddress(""); // Clear selection when searching
    setLoading(true);
    
    const result = await searchAddressesService(postCode, houseNumber);
    
    if (result.status === 'ok' && result.addresses) {
      setAddresses(result.addresses);
    } else {
      setError(result.error || 'An error occurred while searching for addresses');
    }
    
    setLoading(false);
  };

  const clearResults = () => {
    setAddresses([]);
    setSelectedAddress("");
    setError(undefined);
    setLoading(false);
  };

  const handleSelectedAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(e.target.value);
  };

  const clearSelection = () => {
    setSelectedAddress("");
  };

  return {
    addresses,
    loading,
    error,
    selectedAddress,
    searchAddresses,
    clearResults,
    handleSelectedAddressChange,
    clearSelection
  };
};