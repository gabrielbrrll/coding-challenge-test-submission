export interface ValidationError {
  status: "error";
  errormessage: string;
}

export interface GetAddressesQuery {
  postcode?: string | string[];
  streetnumber?: string | string[];
}

export interface AddressSearchFormData {
  postCode: string;
  houseNumber: string;
}

export interface PersonFormData {
  firstName: string;
  lastName: string;
}

/**
 * Validates if a value contains only digits and is non-negative
 */
export const isStrictlyNumeric = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  const num = parseInt(value, 10);
  return /^\d+$/.test(value) && num >= 0 && value === num.toString();
};

/**
 * Validates a numeric field and returns an error if invalid
 */
export const validateNumericField = (value: string, fieldName: string): ValidationError | null => {
  if (!isStrictlyNumeric(value)) {
    return {
      status: "error",
      errormessage: `${fieldName} must be all digits and non negative!`,
    };
  }
  return null;
};

/**
 * Validates the address search form data
 */
export const validateAddressSearchForm = (formData: AddressSearchFormData): string | null => {
  const { postCode, houseNumber } = formData;
  
  const postCodeStr = String(postCode).trim();
  const houseNumberStr = String(houseNumber).trim();
  
  if (postCodeStr === '' || houseNumberStr === '') {
    return "Post code and house number are required!";
  }

  if (postCodeStr.length < 4) {
    return "Post code must be at least 4 characters!";
  }

  return null;
};

/**
 * Validates the person form data
 */
export const validatePersonForm = (formData: PersonFormData): string | null => {
  const { firstName, lastName } = formData;
  
  if (!firstName.trim() || !lastName.trim()) {
    return "First name and last name fields mandatory!";
  }

  if (firstName.length < 2) {
    return "First name must be at least 2 characters!";
  }

  if (lastName.length < 2) {
    return "Last name must be at least 2 characters!";
  }

  return null;
};

/**
 * Validates the complete query parameters for the getAddresses endpoint
 */
export const validateGetAddressesQuery = (query: GetAddressesQuery): ValidationError | null => {
  const { postcode, streetnumber } = query;

  // Check required fields
  if (!postcode || !streetnumber) {
    return {
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    };
  }

  // Convert array to string if needed (Next.js sometimes passes arrays)
  const postcodeStr = Array.isArray(postcode) ? postcode[0] : postcode;
  const streetnumberStr = Array.isArray(streetnumber) ? streetnumber[0] : streetnumber;

  // Check postcode length
  if (postcodeStr.length < 4) {
    return {
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    };
  }

  // Validate postcode format
  const postcodeValidation = validateNumericField(postcodeStr, "Postcode");
  if (postcodeValidation) {
    return postcodeValidation;
  }

  // Validate street number format
  const streetnumberValidation = validateNumericField(streetnumberStr, "Street Number");
  if (streetnumberValidation) {
    return streetnumberValidation;
  }

  return null; // All validations passed
};