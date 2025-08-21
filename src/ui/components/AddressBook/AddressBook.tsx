import React from "react";
import { useAppSelector } from "../../../core/store/hooks";

import useAddressBook from "../../../hooks/useAddressBook";
import Address from "../Address/Address";
import Button from "../Button/Button";
import $ from "./AddressBook.module.css";
import { selectAddress, selectGroupedAddresses } from "../../../core/reducers/addressBookSlice";

const AddressBook = () => {
  const addresses = useAppSelector(selectAddress);
  const groupedAddresses = useAppSelector(selectGroupedAddresses);
  const { removeAddress, loadSavedAddresses, loading } = useAddressBook();
  const addressBookTitle = `📓 Address book (${addresses.length})`;

  React.useEffect(() => {
    loadSavedAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={$.addressBook} aria-labelledby="addressbook-section-title">
      <div className={$.sectionHeader}>
        <span className={$.sectionIcon} aria-hidden="true">📚</span>
        <h2 className={$.sectionTitle} id="addressbook-section-title">
          Your Address Book
          <span className={$.addressCount}>({addresses.length})</span>
        </h2>
      </div>
      {!loading && (
        <>
          {addresses.length === 0 && <p>No addresses found, try add one 😉</p>}
          {groupedAddresses.map((person, personIndex) => {
            return (
              <div key={`${person.firstName}_${person.lastName}`} data-testid={`person-${personIndex}`} className={$.personGroup}>
                <h3 className={$.personName}>
                  {person.firstName} {person.lastName}
                </h3>
                {person.addresses.map((address, addressIndex) => (
                  <div key={address.id} data-testid={`address-${personIndex}-${addressIndex}`} className={$.addressItem}>
                    <div className={$.addressContent}>
                      <span className={$.addressBullet}>•</span>
                      <Address {...address} />
                    </div>
                    <div className={$.remove}>
                      <Button
                        variant="secondary"
                        onClick={() => removeAddress(address.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}
    </section>
  );
};

export default AddressBook;
