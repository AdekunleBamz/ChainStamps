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
 * Shared submit button component for registry transactions.
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
