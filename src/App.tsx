import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Form from "@/components/Form/Form";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";

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
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */
  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    // Validation for address form
    if (!addressFormFields.values.postCode || !addressFormFields.values.houseNumber) {
      setError("Post code and house number are required!");
      return;
    }

    if (addressFormFields.values.postCode.length < 4) {
      setError("Post code must be at least 4 characters!");
      return;
    }

    // Clear previous results
    setAddresses([]);
    setSelectedAddress("");
    
    // TODO: Implement actual API call here
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

    addAddress({ 
      ...foundAddress, 
      firstName: personFormFields.values.firstName.trim(), 
      lastName: personFormFields.values.lastName.trim() 
    });
    
    // Clear form after successful submission
    personFormFields.resetFields();
    setSelectedAddress("");
    setError(undefined);
  };

  const handleClearAllFields = () => {
    addressFormFields.resetFields();
    personFormFields.resetFields();
    setSelectedAddress("");
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label="🏠 Find an address"
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: addressFormFields.values.postCode,
                onChange: addressFormFields.handleChange,
                required: true
              }
            },
            {
              name: "houseNumber", 
              placeholder: "House number",
              extraProps: {
                value: addressFormFields.values.houseNumber,
                onChange: addressFormFields.handleChange,
                required: true
              }
            }
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
          error={error}
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: personFormFields.values.firstName,
                  onChange: personFormFields.handleChange,
                  required: true
                }
              },
              {
                name: "lastName",
                placeholder: "Last name", 
                extraProps: {
                  value: personFormFields.values.lastName,
                  onChange: personFormFields.handleChange,
                  required: true
                }
              }
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        <Button 
          variant="secondary" 
          onClick={handleClearAllFields}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
