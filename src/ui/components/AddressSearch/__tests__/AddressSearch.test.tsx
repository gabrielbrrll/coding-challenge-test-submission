import { render, screen, fireEvent } from '@testing-library/react';
import AddressSearch from '../AddressSearch';
import { useFormFields } from '../../../../hooks/useFormFields';

// Mock the child components
jest.mock('@/components/Form/Form', () => {
  return function MockForm({ label, onFormSubmit, submitText, error }: any) {
    return (
      <div data-testid="form">
        <h3>{label}</h3>
        <button onClick={(e) => onFormSubmit(e)}>{submitText}</button>
        {error && <div data-testid="form-error">{error}</div>}
      </div>
    );
  };
});

jest.mock('@/components/Radio/Radio', () => {
  return function MockRadio({ children, onChange, checked, id }: any) {
    return (
      <label>
        <input 
          type="radio" 
          onChange={onChange}
          checked={checked}
          value={id}
        />
        {children}
      </label>
    );
  };
});

jest.mock('@/components/Address/Address', () => {
  return function MockAddress({ street, houseNumber, city, postcode }: any) {
    return <div>{street} {houseNumber}, {city} {postcode}</div>;
  };
});

describe('AddressSearch', () => {
  const mockAddressFormFields = {
    values: { postCode: '2000', houseNumber: '123' },
    handleChange: jest.fn(),
    resetFields: jest.fn(),
    setFieldValue: jest.fn()
  };

  const mockAddresses = [
    { id: '1', street: 'Main St', houseNumber: '123', city: 'Sydney', postcode: '2000', firstName: '', lastName: '' },
    { id: '2', street: 'George St', houseNumber: '456', city: 'Sydney', postcode: '2000', firstName: '', lastName: '' }
  ];

  const defaultProps = {
    addresses: [],
    loading: false,
    selectedAddress: '',
    addressFormFields: mockAddressFormFields,
    onAddressSubmit: jest.fn(),
    onSelectedAddressChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search form', () => {
    render(<AddressSearch {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Find Address' })).toBeInTheDocument();
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<AddressSearch {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Searching for addresses...')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<AddressSearch {...defaultProps} error="Something went wrong" />);
    
    expect(screen.getByTestId('form-error')).toHaveTextContent('Something went wrong');
  });

  it('displays address results when available', () => {
    render(<AddressSearch {...defaultProps} addresses={mockAddresses} />);
    
    expect(screen.getByText('Select an Address')).toBeInTheDocument();
    expect(screen.getByText('Main St 123, Sydney 2000')).toBeInTheDocument();
    expect(screen.getByText('George St 456, Sydney 2000')).toBeInTheDocument();
  });

  it('handles address selection change', () => {
    const onSelectedAddressChange = jest.fn();
    render(
      <AddressSearch 
        {...defaultProps} 
        addresses={mockAddresses}
        onSelectedAddressChange={onSelectedAddressChange}
      />
    );
    
    const radioInput = screen.getAllByRole('radio')[0];
    fireEvent.click(radioInput);
    
    expect(onSelectedAddressChange).toHaveBeenCalled();
  });
});