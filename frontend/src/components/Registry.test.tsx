import { render, screen } from '@testing-library/react';
import Registry from './Registry';
import { BrowserRouter } from 'react-router-dom';

describe('Registry Component', () => {
  it('renders registry title', () => {
    render(
      <BrowserRouter>
        <Registry />
      </BrowserRouter>
    );
    expect(screen.getByText(/Registry/i)).toBeInTheDocument();
  });
});
