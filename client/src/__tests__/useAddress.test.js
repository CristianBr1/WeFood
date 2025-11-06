import { renderHook, act } from '@testing-library/react';
import { useAddress } from '../hooks/useAddressContext';
import { AddressStoreProvider } from '../context/AddressContext';
import { AuthProvider } from '../context/AuthProvider';
import { MemoryRouter } from 'react-router-dom';

// Mock service
jest.mock('../services/endpoints/address.service', () => ({
  addressService: {
    getAddresses: jest.fn(() => Promise.resolve([])),
    addAddress: jest.fn((address) => Promise.resolve({ ...address, _id: 'mock-id' })),
    updateAddress: jest.fn((id, address) => Promise.resolve({ ...address, _id: id })),
    removeAddress: jest.fn(() => Promise.resolve()),
  },
}));

describe('useAddress Hook', () => {
  const wrapper = ({ children }) => (
    <MemoryRouter>
      <AuthProvider>
        <AddressStoreProvider>{children}</AddressStoreProvider>
      </AuthProvider>
    </MemoryRouter>
  );

  it('should provide address management functions', () => {
    const { result } = renderHook(() => useAddress(), { wrapper });
    
    expect(result.current.addresses).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.addAddress).toBe('function');
    expect(typeof result.current.updateAddress).toBe('function');
    expect(typeof result.current.removeAddress).toBe('function');
    expect(typeof result.current.selectAddress).toBe('function');
  });

  it('should handle address selection', () => {
    const { result } = renderHook(() => useAddress(), { wrapper });
    const mockAddress = { _id: '123', address_line: 'Test St' };

    act(() => {
      // Add address to list
      result.current.addresses = [mockAddress];
      // Select it
      result.current.selectAddress('123');
    });

    expect(result.current.selectedAddressId).toBe('123');
    expect(result.current.selectedAddress).toEqual(mockAddress);
  });

  // Add more tests for addAddress, updateAddress, removeAddress...
});