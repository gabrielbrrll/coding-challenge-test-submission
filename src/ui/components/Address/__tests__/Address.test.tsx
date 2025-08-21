import { render, screen } from '@testing-library/react';
import Address from '../Address';

describe('Address', () => {
  it('formats and displays address correctly', () => {
    const mockAddress = {
      street: 'Main Street',
      houseNumber: '123',
      postcode: '2000',
      city: 'Sydney'
    };

    render(<Address {...mockAddress} />);
    
    expect(screen.getByText('Main Street 123, 2000, Sydney')).toBeInTheDocument();
  });

  it('handles different address data', () => {
    const differentAddress = {
      street: 'George Street',
      houseNumber: '456',
      postcode: '3000',
      city: 'Melbourne'
    };

    render(<Address {...differentAddress} />);
    
    expect(screen.getByText('George Street 456, 3000, Melbourne')).toBeInTheDocument();
  });
});