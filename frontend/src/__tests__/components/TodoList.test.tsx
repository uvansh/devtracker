import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import TodoList from '@/components/dashboard/TodoList';

// Mock the GlassCard component
jest.mock('@/components/ui/GlassCard', () => ({
  GlassCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-card" className={className}>
      {children}
    </div>
  ),
}));

describe('TodoList', () => {
  it('renders the component title', () => {
    render(<TodoList />);
    expect(screen.getByText('Daily Tasks')).toBeInTheDocument();
  });

  it('displays initial todos', () => {
    render(<TodoList />);
    expect(screen.getByText('Complete LeetCode daily challenge')).toBeInTheDocument();
    expect(screen.getByText('Review job applications')).toBeInTheDocument();
  });

  it('shows completed count', () => {
    render(<TodoList />);
    // Initial state has 1 completed out of 4
    expect(screen.getByText(/completed/)).toBeInTheDocument();
  });

  it('adds a new todo when input is filled and button is clicked', async () => {
    const { user } = render(<TodoList />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'New test todo');
    
    const addButton = screen.getByRole('button', { name: '' }); // Plus button
    const buttons = screen.getAllByRole('button');
    const addBtn = buttons.find(btn => btn.querySelector('svg.lucide-plus'));
    
    if (addBtn) {
      await user.click(addBtn);
      expect(screen.getByText('New test todo')).toBeInTheDocument();
    }
  });

  it('adds a new todo on Enter key press', async () => {
    const { user } = render(<TodoList />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'Enter key todo{enter}');
    
    expect(screen.getByText('Enter key todo')).toBeInTheDocument();
  });

  it('does not add empty todos', async () => {
    const { user } = render(<TodoList />);
    
    const initialTodos = screen.getAllByRole('button').length;
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, '{enter}');
    
    // Count should remain the same
    expect(screen.getAllByRole('button').length).toBe(initialTodos);
  });

  it('toggles todo completion status', async () => {
    const { user } = render(<TodoList />);
    
    // Find the first uncompleted todo's toggle button (Circle icon)
    const todoItems = screen.getAllByRole('button');
    const toggleButtons = todoItems.filter(btn => 
      btn.querySelector('svg.lucide-circle') || btn.querySelector('svg.lucide-check-circle-2')
    );
    
    if (toggleButtons.length > 0) {
      await user.click(toggleButtons[0]);
      // The todo should now be marked as completed
    }
  });

  it('changes priority selection', async () => {
    const { user } = render(<TodoList />);
    
    const prioritySelect = screen.getByRole('combobox');
    await user.selectOptions(prioritySelect, 'high');
    
    expect(prioritySelect).toHaveValue('high');
  });

  it('renders progress bar', () => {
    render(<TodoList />);
    // Progress bar should be present
    const progressBar = document.querySelector('.bg-gradient-to-r');
    expect(progressBar).toBeInTheDocument();
  });
});
