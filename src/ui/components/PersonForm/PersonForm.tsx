import React, { useEffect, useRef } from 'react';
import Form from '@/components/Form/Form';
import { useFormFields } from '../../../hooks/useFormFields';
import styles from './PersonForm.module.css';

interface PersonFormProps {
  personFormFields: ReturnType<typeof useFormFields>;
  error?: string;
  onPersonSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PersonForm: React.FC<PersonFormProps> = ({
  personFormFields,
  error,
  onPersonSubmit
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, []);

  return (
    <div ref={formRef} className={styles.personFormSection}>
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
        onFormSubmit={onPersonSubmit}
        submitText="Add to Address Book"
        error={error}
        errorId="person-error"
      />
    </div>
  );
};

export default PersonForm;