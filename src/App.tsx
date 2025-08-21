import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Form from "@/components/Form/Form";
import Radio from "@/components/Radio/Radio";
import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";
import transformAddress, { RawAddressModel } from "./core/models/address";
import { validateAddressForDuplicates } from "./core/reducers/addressBookSlice";
import { useAppSelector } from "./core/store/hooks";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states using custom hook
   */
  const addressFormFields = useFormFields({
    postCode: "",
    houseNumber: ""
  });
  
  const personFormFields = useFormFields({
    firstName: "",
    lastName: ""
  });
  
  const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  /**
   * Redux actions and selectors
   */
  const { addAddress } = useAddressBook();
  const existingAddresses = useAppSelector(state => state.addressBook.addresses);

  /**
   * Text fields onChange handlers
   */
  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    // Validation for address form - ensure strings are properly handled
    const postCodeStr = String(addressFormFields.values.postCode).trim();
    const houseNumberStr = String(addressFormFields.values.houseNumber).trim();
    
    if (postCodeStr === '' || houseNumberStr === '') {
      setError("Post code and house number are required!");
      return;
    }

    if (postCodeStr.length < 4) {
      setError("Post code must be at least 4 characters!");
      return;
    }

    // Clear previous results
    setAddresses([]);
    setSelectedAddress("");
    setLoading(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
      const url = `${baseUrl}/api/getAddresses?postcode=${postCodeStr}&streetnumber=${houseNumberStr}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.errormessage || 'Failed to fetch addresses');
        return;
      }

      if (data.status === 'ok' && data.details) {
        const transformedAddresses = data.details.map((rawAddress: RawAddressModel) => {
          return transformAddress(rawAddress);
        });
        setAddresses(transformedAddresses);
      } else {
        setError(data.errormessage || 'No addresses found');
      }
    } catch (err) {
      setError('Network error occurred while fetching addresses');
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    // Validation for person form
    if (!personFormFields.values.firstName.trim() || !personFormFields.values.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (personFormFields.values.firstName.length < 2) {
      setError("First name must be at least 2 characters!");
      return;
    }

    if (personFormFields.values.lastName.length < 2) {
      setError("Last name must be at least 2 characters!");
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

    // Create the new address with person info and unique ID
    const newAddress: AddressType = {
      ...foundAddress,
      firstName: personFormFields.values.firstName.trim(),
      lastName: personFormFields.values.lastName.trim(),
      id: `${foundAddress.id}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    };

    // Validate for duplicates
    const duplicateCheck = validateAddressForDuplicates(existingAddresses, newAddress);

    if (duplicateCheck.isDuplicate) {
      setError("This person already has this address in the address book!");
      return;
    }

    // Show info message if person exists with different address
    if (duplicateCheck.personExists) {
      // We'll still add it, but show a message
      addAddress(newAddress);
      setError(undefined);
      // Clear form after successful submission
      personFormFields.resetFields();
      setSelectedAddress("");
    } else {
      addAddress(newAddress);
      setError(undefined);
      // Clear form after successful submission
      personFormFields.resetFields();
      setSelectedAddress("");
    }
  };

  const handleClearAllFields = () => {
    addressFormFields.resetFields();
    personFormFields.resetFields();
    setSelectedAddress("");
    setAddresses([]);
    setError(undefined);
    setLoading(false);
  };

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          Create Your Address Book
        </h1>
        <p className={styles.headerSubtitle}>
          Enter a postcode and house number to find addresses, then add personal information to build your address book.
        </p>
      </header>
      
      <div className={styles.mainContent}>
        <section className={styles.addressSearchSection} aria-labelledby="search-section-title">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon} aria-hidden="true">🏠</span>
            <h2 className={styles.sectionTitle} id="search-section-title">
              Find Address
            </h2>
          </div>
          <div className={styles.formSection}>
            <Form
              label="Search for Address"
              loading={loading}
              formEntries={[
                {
                  name: "postCode",
                  placeholder: "Post Code",
                  extraProps: {
                    value: addressFormFields.values.postCode,
                    onChange: addressFormFields.handleChange,
                    required: true,
                    disabled: loading,
                    'aria-describedby': error ? 'address-error' : undefined
                  }
                },
                {
                  name: "houseNumber", 
                  placeholder: "House Number",
                  extraProps: {
                    value: addressFormFields.values.houseNumber,
                    onChange: addressFormFields.handleChange,
                    required: true,
                    disabled: loading,
                    'aria-describedby': error ? 'address-error' : undefined
                  }
                }
              ]}
              onFormSubmit={handleAddressSubmit}
              submitText="Find Address"
              error={error}
              errorId="address-error"
            />
          </div>
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner} aria-hidden="true"></div>
              <p>Searching for addresses...</p>
            </div>
          )}

          {addresses.length > 0 && (
            <div className={styles.addressResults}>
              <h3 className={styles.addressResultsTitle}>
                Select an Address
                <span className={styles.addressResultsCount} aria-label={`${addresses.length} addresses found`}>
                  {addresses.length}
                </span>
              </h3>
              <div className={styles.addressGrid} role="radiogroup" aria-labelledby="address-selection-title">
                <span id="address-selection-title" className="sr-only">Choose an address from the results</span>
                {addresses.map((address) => (
                  <Radio
                    name="selectedAddress"
                    id={address.id}
                    key={address.id}
                    onChange={handleSelectedAddressChange}
                    checked={selectedAddress === address.id}
                  >
                    <Address {...address} />
                  </Radio>
                ))}
              </div>
            </div>
          )}
          {selectedAddress && (
            <div className={styles.personFormSection}>
              <Form
                label="Add Personal Information"
                formEntries={[
                  {
                    name: "firstName",
                    placeholder: "First Name",
                    extraProps: {
                      value: personFormFields.values.firstName,
                      onChange: personFormFields.handleChange,
                      required: true,
                      'aria-describedby': error ? 'person-error' : undefined
                    }
                  },
                  {
                    name: "lastName",
                    placeholder: "Last Name", 
                    extraProps: {
                      value: personFormFields.values.lastName,
                      onChange: personFormFields.handleChange,
                      required: true,
                      'aria-describedby': error ? 'person-error' : undefined
                    }
                  }
                ]}
                onFormSubmit={handlePersonSubmit}
                submitText="Add to Address Book"
                error={error}
                errorId="person-error"
              />
            </div>
          )}

          <div className={styles.clearButtonContainer}>
            <Button 
              variant="secondary" 
              onClick={handleClearAllFields}
              aria-label="Clear all form fields and reset the application"
            >
              Clear All Fields
            </Button>
          </div>
        </section>

        <section className={styles.addressBookSection} aria-labelledby="addressbook-section-title">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon} aria-hidden="true">📚</span>
            <h2 className={styles.sectionTitle} id="addressbook-section-title">
              Your Address Book
            </h2>
          </div>
          <AddressBook />
        </section>
      </div>
    </main>
  );
}

export default App;
