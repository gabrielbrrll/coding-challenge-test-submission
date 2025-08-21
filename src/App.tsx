import React from "react";

import AddressSearch from "./ui/components/AddressSearch/AddressSearch";
import PersonForm from "./ui/components/PersonForm/PersonForm";
import AddressBookSection from "./ui/components/AddressBookSection/AddressBookSection";
import Button from "./ui/components/Button/Button";
import { useAddressSearch } from "./hooks/useAddressSearch";
import { useAddressForm } from "./hooks/useAddressForm";
import { usePersonForm } from "./hooks/usePersonForm";

import styles from "./App.module.css";

function App() {
  const { 
    addresses, 
    loading, 
    error: searchError, 
    selectedAddress,
    searchAddresses, 
    clearResults,
    handleSelectedAddressChange,
    clearSelection
  } = useAddressSearch();
  
  const {
    addressFormFields,
    error: addressFormError,
    handleAddressSubmit,
    clearAddressForm,
    setError: setAddressFormError
  } = useAddressForm(searchAddresses);

  const {
    personFormFields,
    error: personFormError,
    handlePersonSubmit,
    clearPersonForm,
    setError: setPersonFormError
  } = usePersonForm(selectedAddress, addresses);


  const handleClearAllFields = () => {
    clearAddressForm();
    clearPersonForm();
    clearResults(); // This now also clears selection
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
        <div className={styles.leftColumn}>
          <div className={styles.addressSearchContainer}>
            <AddressSearch
              addresses={addresses}
              loading={loading}
              error={searchError || addressFormError}
              selectedAddress={selectedAddress}
              addressFormFields={addressFormFields}
              onAddressSubmit={handleAddressSubmit}
              onSelectedAddressChange={handleSelectedAddressChange}
            />
            
            {selectedAddress && (
              <PersonForm
                personFormFields={personFormFields}
                error={personFormError}
                onPersonSubmit={handlePersonSubmit}
              />
            )}
          </div>
          
          {(addresses.length > 0 || selectedAddress) && (
            <div className={styles.clearButtonContainer}>
              <Button 
                variant="secondary" 
                onClick={handleClearAllFields}
                aria-label="Clear all form fields and reset the application"
              >
                Clear All Fields
              </Button>
            </div>
          )}
        </div>

        <div className={styles.rightColumn}>
          <AddressBookSection />
        </div>
      </div>
    </main>
  );
}

export default App;
