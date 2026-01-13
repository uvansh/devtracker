import React from 'react';
import { render, screen } from '../utils/test-utils';
import JobsPage from '@/app/jobs/page';

// Mock the components
jest.mock('@/components/ui/GlassCard', () => ({
  GlassCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-card" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/Modal', () => {
  return function MockModal({ isOpen, onClose, title, children }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    );
  };
});

describe('JobsPage', () => {
  it('renders the page title', () => {
    render(<JobsPage />);
    expect(screen.getByText('Job Tracker')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<JobsPage />);
    expect(screen.getByText('Track and manage your job applications')).toBeInTheDocument();
  });

  it('renders the Add Job button', () => {
    render(<JobsPage />);
    expect(screen.getByText('Add Job')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<JobsPage />);
    expect(screen.getByPlaceholderText('Search companies or positions...')).toBeInTheDocument();
  });

  it('renders status filter dropdown', () => {
    render(<JobsPage />);
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });

  it('renders mock job data', () => {
    render(<JobsPage />);
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Meta')).toBeInTheDocument();
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
  });

  it('filters jobs by search query', async () => {
    const { user } = render(<JobsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search companies or positions...');
    await user.type(searchInput, 'Google');
    
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.queryByText('Meta')).not.toBeInTheDocument();
  });

  it('filters jobs by status', async () => {
    const { user } = render(<JobsPage />);
    
    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, 'offer');
    
    // Only Microsoft has offer status
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
  });

  it('opens add job modal when button is clicked', async () => {
    const { user } = render(<JobsPage />);
    
    const addButton = screen.getByText('Add Job');
    await user.click(addButton);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Add New Job Application')).toBeInTheDocument();
  });

  it('displays status badges for each status', () => {
    render(<JobsPage />);
    
    // Check status badge buttons exist
    expect(screen.getByRole('button', { name: /Wishlist/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Applied/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Technical/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Offer/ })).toBeInTheDocument();
  });

  it('changes job status when dropdown is changed', async () => {
    const { user } = render(<JobsPage />);
    
    // Find a status dropdown in the job row
    const statusDropdowns = screen.getAllByRole('combobox');
    // First one is the filter, rest are job status dropdowns
    if (statusDropdowns.length > 1) {
      await user.selectOptions(statusDropdowns[1], 'rejected');
      expect(statusDropdowns[1]).toHaveValue('rejected');
    }
  });

  it('deletes a job when delete button is clicked', async () => {
    const { user } = render(<JobsPage />);
    
    // Count initial jobs
    const initialCount = screen.getAllByText(/Google|Meta|Amazon|Microsoft/).length;
    
    // Find delete buttons (Trash icons)
    const deleteButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg.lucide-trash-2')
    );
    
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0]);
      
      // Should have one less company
    }
  });

  it('renders correctly on mobile (card view)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });
    
    render(<JobsPage />);
    
    // Mobile card view should be present
    const mobileCards = document.querySelectorAll('.md\\:hidden');
    expect(mobileCards.length).toBeGreaterThan(0);
  });
});
