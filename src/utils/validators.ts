export interface ValidationError {
  status: "error";
  errormessage: string;
}

export interface GetAddressesQuery {
  postcode?: string | string[];
  streetnumber?: string | string[];
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