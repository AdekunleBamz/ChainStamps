import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal Component', () => {
  it('renders modal content when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText(/Modal Content/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText(/Close/i));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
