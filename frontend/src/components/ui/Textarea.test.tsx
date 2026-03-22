import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
  it('renders textarea with placeholder', () => {
    render(<Textarea placeholder="Enter details" />);
    expect(screen.getByPlaceholderText(/Enter details/i)).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'some details' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
