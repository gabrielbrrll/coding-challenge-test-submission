import { useState } from 'react';
import { useFormFields } from './useFormFields';
import { validateAddressSearchForm } from '../utils/validators';

interface UseAddressFormReturn {
  addressFormFields: ReturnType<typeof useFormFields>;
  error: string | undefined;
  handleAddressSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  clearAddressForm: () => void;
  setError: (error: string | undefined) => void;
}

export const useAddressForm = (
  onAddressSearch: (postCode: string, houseNumber: string) => Promise<void>
): UseAddressFormReturn => {
  const addressFormFields = useFormFields({
    postCode: "",
    houseNumber: ""
  });
  
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const validationError = validateAddressSearchForm({
      postCode: addressFormFields.values.postCode,
      houseNumber: addressFormFields.values.houseNumber
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    const postCodeStr = String(addressFormFields.values.postCode).trim();
    const houseNumberStr = String(addressFormFields.values.houseNumber).trim();

    await onAddressSearch(postCodeStr, houseNumberStr);
  };

  const clearAddressForm = () => {
    addressFormFields.resetFields();
    setError(undefined);
  };

  return {
    addressFormFields,
    error,
    handleAddressSubmit,
    clearAddressForm,
    setError
  };
};