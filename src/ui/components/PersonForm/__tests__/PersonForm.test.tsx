import { render, screen, fireEvent } from '@testing-library/react';
import PersonForm from '../PersonForm';

// Mock scrollIntoView
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true
});

// Mock the Form component
jest.mock('@/components/Form/Form', () => {
  return function MockForm({ label, onFormSubmit, submitText, error, formEntries }: any) {
    return (
      <div data-testid="person-form">
        <h3>{label}</h3>
        {formEntries.map((entry: any, index: number) => (
          <input
            key={index}
            name={entry.name}
            placeholder={entry.placeholder}
            value={entry.extraProps.value}
            onChange={entry.extraProps.onChange}
            required={entry.extraProps.required}
            data-testid={entry.name}
          />
        ))}
        <button onClick={(e) => onFormSubmit(e)}>{submitText}</button>
        {error && <div data-testid="person-form-error">{error}</div>}
      </div>
    );
  };
});

describe('PersonForm', () => {
  const mockPersonFormFields = {
    values: { firstName: 'John', lastName: 'Doe' },
    handleChange: jest.fn(),
    resetFields: jest.fn(),
    setFieldValue: jest.fn()
  };

  const defaultProps = {
    personFormFields: mockPersonFormFields,
    onPersonSubmit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with correct labels and fields', () => {
    render(<PersonForm {...defaultProps} />);
    
    expect(screen.getByText('Add Personal Information')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Add to Address Book')).toBeInTheDocument();
  });

  it('displays form field values', () => {
    render(<PersonForm {...defaultProps} />);
    
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  it('handles form submission', () => {
    const onPersonSubmit = jest.fn();
    render(<PersonForm {...defaultProps} onPersonSubmit={onPersonSubmit} />);
    
    const submitButton = screen.getByText('Add to Address Book');
    fireEvent.click(submitButton);
    
    expect(onPersonSubmit).toHaveBeenCalled();
  });

  it('displays error message when provided', () => {
    render(<PersonForm {...defaultProps} error="Name is required" />);
    
    expect(screen.getByTestId('person-form-error')).toHaveTextContent('Name is required');
  });

  it('calls handleChange when input values change', () => {
    const handleChange = jest.fn();
    const fieldsWithHandler = {
      ...mockPersonFormFields,
      handleChange
    };
    
    render(<PersonForm {...defaultProps} personFormFields={fieldsWithHandler} />);
    
    const firstNameInput = screen.getByTestId('firstName');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('sets required attributes on form fields', () => {
    render(<PersonForm {...defaultProps} />);
    
    expect(screen.getByTestId('firstName')).toBeRequired();
    expect(screen.getByTestId('lastName')).toBeRequired();
  });
});