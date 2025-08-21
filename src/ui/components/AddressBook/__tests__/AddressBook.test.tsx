import { render, screen, fireEvent } from '@testing-library/react';
import AddressBook from '../AddressBook';

// Mock Redux hooks
jest.mock('../../../../core/store/hooks', () => ({
  useAppSelector: jest.fn()
}));

const { useAppSelector } = require('../../../../core/store/hooks');

// Mock the useAddressBook hook
const mockRemoveAddress = jest.fn();
const mockLoadSavedAddresses = jest.fn();
jest.mock('../../../../hooks/useAddressBook', () => ({
  __esModule: true,
  default: () => ({
    removeAddress: mockRemoveAddress,
    loadSavedAddresses: mockLoadSavedAddresses,
    loading: false
  })
}));

// Mock child components
jest.mock('@/components/Address/Address', () => {
  return function MockAddress({ street, houseNumber, city, postcode }: any) {
    return <div data-testid="address">{street} {houseNumber}, {city} {postcode}</div>;
  };
});

jest.mock('@/components/Button/Button', () => {
  return function MockButton({ children, onClick, variant }: any) {
    return (
      <button onClick={onClick} data-variant={variant}>
        {children}
      </button>
    );
  };
});

describe('AddressBook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section header with address count and empty message', () => {
    useAppSelector
      .mockReturnValueOnce([]) // selectAddress
      .mockReturnValueOnce([]); // selectGroupedAddresses
    
    render(<AddressBook />);
    
    expect(screen.getByText('Your Address Book')).toBeInTheDocument();
    expect(screen.getByText('(0)')).toBeInTheDocument();
    expect(screen.getByText('No addresses found, try add one 😉')).toBeInTheDocument();
  });

  it('displays grouped addresses by person', () => {
    const mockAddresses = [
      { id: '1', firstName: 'John', lastName: 'Doe', street: 'Main St', houseNumber: '123', city: 'Sydney', postcode: '2000' }
    ];
    const mockGroupedAddresses = [
      {
        firstName: 'John',
        lastName: 'Doe',
        addresses: mockAddresses
      }
    ];

    useAppSelector
      .mockReturnValueOnce(mockAddresses) // selectAddress
      .mockReturnValueOnce(mockGroupedAddresses); // selectGroupedAddresses

    render(<AddressBook />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('address')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('calls removeAddress when remove button is clicked', () => {
    const mockAddresses = [
      { id: '1', firstName: 'John', lastName: 'Doe', street: 'Main St', houseNumber: '123', city: 'Sydney', postcode: '2000' }
    ];
    const mockGroupedAddresses = [
      {
        firstName: 'John',
        lastName: 'Doe',
        addresses: mockAddresses
      }
    ];

    useAppSelector
      .mockReturnValueOnce(mockAddresses)
      .mockReturnValueOnce(mockGroupedAddresses);

    render(<AddressBook />);
    
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(mockRemoveAddress).toHaveBeenCalledWith('1');
  });

  it('loads saved addresses on mount', () => {
    useAppSelector
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    render(<AddressBook />);
    
    expect(mockLoadSavedAddresses).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    useAppSelector
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);
    
    render(<AddressBook />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'addressbook-section-title');
    
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveAttribute('id', 'addressbook-section-title');
  });
});