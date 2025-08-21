import React from 'react';
import Form from '@/components/Form/Form';
import Radio from '@/components/Radio/Radio';
import Address from '@/components/Address/Address';
import { Address as AddressType } from '@/types';
import { useFormFields } from '../../../hooks/useFormFields';
import styles from './AddressSearch.module.css';

interface AddressSearchProps {
  addresses: AddressType[];
  loading: boolean;
  error?: string;
  selectedAddress: string;
  addressFormFields: ReturnType<typeof useFormFields>;
  personFormFields: ReturnType<typeof useFormFields>;
  personFormError?: string;
  onAddressSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onSelectedAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPersonSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  addresses,
  loading,
  error,
  selectedAddress,
  addressFormFields,
  onAddressSubmit,
  onSelectedAddressChange
}) => {
  return (
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
          onFormSubmit={onAddressSubmit}
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
                onChange={onSelectedAddressChange}
                checked={selectedAddress === address.id}
              >
                <Address {...address} />
              </Radio>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};

export default AddressSearch;