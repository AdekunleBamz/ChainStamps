import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('Search Integration', () => {
  it('updates search input value', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const searchInput = screen.getByPlaceholderText(/Search by address/i);
    fireEvent.change(searchInput, { target: { value: '0x123' } });
    expect(searchInput).toHaveValue('0x123');
  });
});
