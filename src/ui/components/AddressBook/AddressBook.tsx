import React from "react";
import { useAppSelector } from "../../../core/store/hooks";

import useAddressBook from "../../hooks/useAddressBook";
import Address from "../Address/Address";
import Button from "../Button/Button";
import Card from "../Card/Card";
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
    <section className={$.addressBook}>
      <h2>{addressBookTitle}</h2>
      {!loading && (
        <>
          {addresses.length === 0 && <p>No addresses found, try add one 😉</p>}
          {groupedAddresses.map((person, personIndex) => {
            return (
              <Card key={`${person.firstName}_${person.lastName}`}>
                <div data-testid={`person-${personIndex}`} className={$.personGroup}>
                  <h3>
                    {person.firstName} {person.lastName}
                  </h3>
                  {person.addresses.map((address, addressIndex) => (
                    <div key={address.id} data-testid={`address-${personIndex}-${addressIndex}`} className={$.addressItem}>
                      <div className={$.addressContent}>
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
              </Card>
            );
          })}
        </>
      )}
    </section>
  );
};

export default AddressBook;
