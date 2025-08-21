import React from 'react';
import AddressBook from '@/components/AddressBook/AddressBook';
import { useAppSelector } from '../../../core/store/hooks';
import { selectAddress } from '../../../core/reducers/addressBookSlice';
import styles from './AddressBookSection.module.css';

const AddressBookSection: React.FC = () => {
  const addresses = useAppSelector(selectAddress);
  
  return (
    <section className={styles.addressBookSection} aria-labelledby="addressbook-section-title">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon} aria-hidden="true">📚</span>
        <h2 className={styles.sectionTitle} id="addressbook-section-title">
          Your Address Book
          <span className={styles.addressCount}>({addresses.length})</span>
        </h2>
      </div>
      <AddressBook />
    </section>
  );
};

export default AddressBookSection;