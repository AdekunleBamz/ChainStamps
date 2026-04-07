import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './Button';

interface SubmitButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  loadingText: string;
  idleText: string;
  ariaBusy: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

/**
 * SubmitButton component with integrated loading state and icons.
 * This button is designed for form submissions, handling loading states and accessibility.
 *
 * @param {Object} props - Component properties.
 * @param {function} props.onClick - Function to call on click.
 * @param {boolean} props.isLoading - Controls the loading state of the button.
 * @param {boolean} [props.disabled] - Optional disabled state for the button.
 * @param {string} props.loadingText - Text to display when the button is in a loading state.
 * @param {string} props.idleText - Text to display when the button is in an idle state.
 * @param {boolean} [props.ariaBusy] - Optional ARIA busy state for accessibility.
 * @param {string} [props.className] - Optional CSS classes to apply to the button.
 * @param {'primary' | 'secondary' | 'ghost'} [props.variant] - Visual variant of the button.
 * @param {'sm' | 'md' | 'lg' | 'icon'} [props.size] - Size of the button.
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  isLoading,
  disabled,
  loadingText,
  idleText,
  ariaBusy,
  className = 'submit-btn w-full flex-center',
  variant = 'primary',
  size = 'lg'
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={ariaBusy || isLoading}
      aria-label={isLoading ? loadingText : idleText}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="spinning mr-2" size={18} strokeWidth={1.5} />
          {loadingText}
        </>
      ) : (
        idleText
      )}
    </Button>
  );
};
