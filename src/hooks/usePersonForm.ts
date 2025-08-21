import { useState } from 'react';
import { Address } from '../types';
import { useFormFields } from './useFormFields';
import useAddressBook from './useAddressBook';
import { validateAddressForDuplicates } from '../core/reducers/addressBookSlice';
import { useAppSelector } from '../core/store/hooks';
import { validatePersonForm } from '../utils/validators';

interface UsePersonFormReturn {
  personFormFields: ReturnType<typeof useFormFields>;
  error: string | undefined;
  handlePersonSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  clearPersonForm: () => void;
  setError: (error: string | undefined) => void;
}

export const usePersonForm = (
  selectedAddress: string,
  addresses: Address[]
): UsePersonFormReturn => {
  const personFormFields = useFormFields({
    firstName: "",
    lastName: ""
  });
  
  const [error, setError] = useState<string | undefined>(undefined);
  
  const { addAddress } = useAddressBook();
  const existingAddresses = useAppSelector(state => state.addressBook.addresses);

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const validationError = validatePersonForm({
      firstName: personFormFields.values.firstName,
      lastName: personFormFields.values.lastName
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError("No address selected, try to select an address or find one if you haven't");
      return;
    }

    const foundAddress = addresses.find((address) => address.id === selectedAddress);

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    const newAddress: Address = {
      ...foundAddress,
      firstName: personFormFields.values.firstName.trim(),
      lastName: personFormFields.values.lastName.trim(),
      id: `${foundAddress.id}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    };

    const duplicateCheck = validateAddressForDuplicates(existingAddresses, newAddress);

    if (duplicateCheck.isDuplicate) {
      setError("This person already has this address in the address book!");
      return;
    }

    addAddress(newAddress);
    setError(undefined);
    personFormFields.resetFields();
  };

  const clearPersonForm = () => {
    personFormFields.resetFields();
    setError(undefined);
  };

  return {
    personFormFields,
    error,
    handlePersonSubmit,
    clearPersonForm,
    setError
  };
};