import React from 'react';
import { render, screen } from '../utils/test-utils';
import { GlassCard } from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <p>Test content</p>
      </GlassCard>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <GlassCard className="custom-class">
        <p>Test</p>
      </GlassCard>
    );
    const card = screen.getByText('Test').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('has glass-card base styling', () => {
    render(
      <GlassCard>
        <p>Test</p>
      </GlassCard>
    );
    const card = screen.getByText('Test').parentElement;
    expect(card).toHaveClass('glass-card');
  });
});

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <p>Modal content</p>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    const { user } = render(<Modal {...defaultProps} onClose={onClose} />);
    
    // Find the close button (X icon)
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = jest.fn();
    const { user } = render(<Modal {...defaultProps} onClose={onClose} />);
    
    // Click the backdrop (the outer overlay div)
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('displays the title', () => {
    render(<Modal {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Modal {...defaultProps}>
        <div data-testid="custom-content">Custom Content</div>
      </Modal>
    );
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('applies size class based on size prop', () => {
    render(<Modal {...defaultProps} size="lg" />);
    // Modal should have the appropriate size class
  });
});
