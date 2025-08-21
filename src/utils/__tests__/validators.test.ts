import { isStrictlyNumeric, validateNumericField, validateGetAddressesQuery } from '../validators';

describe('validators', () => {
  describe('isStrictlyNumeric', () => {
    it('should return true for valid numeric strings', () => {
      expect(isStrictlyNumeric('123')).toBe(true);
      expect(isStrictlyNumeric('0')).toBe(true);
      expect(isStrictlyNumeric('999')).toBe(true);
    });

    it('should return false for invalid inputs', () => {
      expect(isStrictlyNumeric('')).toBe(false);
      expect(isStrictlyNumeric('abc')).toBe(false);
      expect(isStrictlyNumeric('12a')).toBe(false);
      expect(isStrictlyNumeric('-123')).toBe(false);
      expect(isStrictlyNumeric('12.34')).toBe(false);
    });
  });

  describe('validateNumericField', () => {
    it('should return null for valid numeric fields', () => {
      expect(validateNumericField('123', 'Test Field')).toBeNull();
    });

    it('should return error for invalid numeric fields', () => {
      const result = validateNumericField('abc', 'Test Field');
      expect(result).toEqual({
        status: 'error',
        errormessage: 'Test Field must be all digits and non negative!'
      });
    });
  });

  describe('validateGetAddressesQuery', () => {
    it('should return null for valid query parameters', () => {
      const query = { postcode: '2133', streetnumber: '123' };
      expect(validateGetAddressesQuery(query)).toBeNull();
    });

    it('should return error for missing required fields', () => {
      const query = { postcode: '2133' };
      const result = validateGetAddressesQuery(query);
      expect(result).toEqual({
        status: 'error',
        errormessage: 'Postcode and street number fields mandatory!'
      });
    });

    it('should return error for short postcode', () => {
      const query = { postcode: '21', streetnumber: '123' };
      const result = validateGetAddressesQuery(query);
      expect(result).toEqual({
        status: 'error',
        errormessage: 'Postcode must be at least 4 digits!'
      });
    });

    it('should handle array parameters (Next.js query format)', () => {
      const query = { postcode: ['2133'], streetnumber: ['123'] };
      expect(validateGetAddressesQuery(query)).toBeNull();
    });
  });
});