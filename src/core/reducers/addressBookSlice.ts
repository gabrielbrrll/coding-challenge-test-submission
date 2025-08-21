import { Address, DuplicateValidationResult } from "@/types";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

// Helper function to check for duplicates
const checkDuplicateAddress = (addresses: Address[], newAddress: Address): DuplicateValidationResult => {
  const normalizeAddress = (addr: Address) => 
    `${addr.firstName.toLowerCase().trim()}_${addr.lastName.toLowerCase().trim()}_${addr.street.toLowerCase().trim()}_${addr.city.toLowerCase().trim()}_${addr.postcode}`;

  const newAddressKey = normalizeAddress(newAddress);
  const existingAddress = addresses.find(addr => normalizeAddress(addr) === newAddressKey);

  if (existingAddress) {
    return {
      isDuplicate: true,
      existingAddress,
      personExists: true
    };
  }

  // Check if person exists with different address
  const personExists = addresses.some(addr => 
    addr.firstName.toLowerCase().trim() === newAddress.firstName.toLowerCase().trim() &&
    addr.lastName.toLowerCase().trim() === newAddress.lastName.toLowerCase().trim()
  );

  return {
    isDuplicate: false,
    personExists
  };
};

export const addressBookSlice = createSlice({
  name: "addressBook",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      const duplicateCheck = checkDuplicateAddress(state.addresses, action.payload);
      if (!duplicateCheck.isDuplicate) {
        state.addresses.push(action.payload);
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// Selectors
export const selectAddress = (state: RootState) => state.addressBook.addresses;

// Memoized selector to get grouped addresses by person
export const selectGroupedAddresses = createSelector(
  [selectAddress],
  (addresses) => {
    const groups = addresses.reduce((acc: { [key: string]: Address[] }, address) => {
      const key = `${address.firstName}_${address.lastName}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(address);
      return acc;
    }, {});

    return Object.entries(groups).map(([, addresses]) => ({
      firstName: addresses[0].firstName,
      lastName: addresses[0].lastName,
      addresses: addresses.sort((a, b) => a.street.localeCompare(b.street))
    }));
  }
);

// Function to validate address before adding (used outside Redux)
export const validateAddressForDuplicates = (addresses: Address[], newAddress: Address): DuplicateValidationResult => {
  return checkDuplicateAddress(addresses, newAddress);
};

export default addressBookSlice.reducer;
