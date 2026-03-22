import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
  const { theme } = useTheme();
  return <div>Current theme: {theme}</div>;
};

describe('ThemeProvider', () => {
  it('provides default dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText(/Current theme: dark/i)).toBeInTheDocument();
  });
});
