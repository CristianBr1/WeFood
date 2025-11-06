import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import ProtectedRoute from '../components/ProtectedRoute';

describe('ProtectedRoute', () => {
  const mockChild = <div>Protected Content</div>;
  
  const renderWithAuth = (user) => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user }}>
          <ProtectedRoute>{mockChild}</ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it('should show loading while checking auth', () => {
    renderWithAuth(undefined);
    expect(screen.getByText('Verificando autenticação...')).toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    renderWithAuth({ _id: '123', name: 'Test User' });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when user is not authenticated', () => {
    const { container } = renderWithAuth(null);
    // Navigate renders nothing in test env
    expect(container.innerHTML).toBe('');
  });
});