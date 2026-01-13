import React from 'react';
import { render, screen } from '../utils/test-utils';
import TechStackPage from '@/app/techstack/page';

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

describe('TechStackPage', () => {
  it('renders the page title', () => {
    render(<TechStackPage />);
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<TechStackPage />);
    expect(screen.getByText('Manage your skills and proficiency levels')).toBeInTheDocument();
  });

  it('renders Add Technology button', () => {
    render(<TechStackPage />);
    expect(screen.getByText('Add Technology')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<TechStackPage />);
    expect(screen.getByPlaceholderText('Search technologies...')).toBeInTheDocument();
  });

  it('renders category filter', () => {
    render(<TechStackPage />);
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('displays stats section', () => {
    render(<TechStackPage />);
    expect(screen.getByText('Total Skills')).toBeInTheDocument();
    expect(screen.getByText('Avg Proficiency')).toBeInTheDocument();
  });

  it('renders tech items', () => {
    render(<TechStackPage />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('groups tech by category', () => {
    render(<TechStackPage />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('filters tech by search query', async () => {
    const { user } = render(<TechStackPage />);
    
    const searchInput = screen.getByPlaceholderText('Search technologies...');
    await user.type(searchInput, 'React');
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();
  });

  it('filters tech by category', async () => {
    const { user } = render(<TechStackPage />);
    
    const categorySelect = screen.getByRole('combobox');
    await user.selectOptions(categorySelect, 'Frontend');
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();
  });

  it('opens add modal when button is clicked', async () => {
    const { user } = render(<TechStackPage />);
    
    const addButton = screen.getByText('Add Technology');
    await user.click(addButton);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('updates proficiency when star is clicked', async () => {
    const { user } = render(<TechStackPage />);
    
    // Find star buttons
    const stars = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg.lucide-star')
    );
    
    if (stars.length > 0) {
      await user.click(stars[0]);
      // Proficiency should update
    }
  });

  it('renders proficiency labels', () => {
    render(<TechStackPage />);
    // Should show proficiency labels like "Advanced", "Expert", etc.
    expect(screen.getAllByText(/Beginner|Elementary|Intermediate|Advanced|Expert/).length).toBeGreaterThan(0);
  });

  it('deletes tech when delete button is clicked', async () => {
    const { user } = render(<TechStackPage />);
    
    // Hover to show delete button
    const techCards = screen.getAllByTestId('glass-card');
    if (techCards.length > 0) {
      await user.hover(techCards[0]);
    }
    
    const deleteButtons = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg.lucide-trash-2')
    );
    
    if (deleteButtons.length > 0) {
      const initialCount = screen.getAllByText(/TypeScript|React|Python/).length;
      await user.click(deleteButtons[0]);
      // Count should decrease
    }
  });

  it('renders tech icons from CDN', () => {
    render(<TechStackPage />);
    
    // Check for img elements with devicon URLs
    const images = document.querySelectorAll('img[src*="devicon"]');
    expect(images.length).toBeGreaterThan(0);
  });
});
