import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header Component', () => {
  it('renders logo text', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/BitLegacy/i)).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /Registry/i })).toBeInTheDocument();
  });
});
