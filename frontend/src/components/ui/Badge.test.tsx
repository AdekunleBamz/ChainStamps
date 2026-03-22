import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders badge with label', () => {
    render(<Badge>Beta</Badge>);
    expect(screen.getByText(/Beta/i)).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText(/Outline/i);
    expect(badge).toHaveClass('outline');
  });
});
