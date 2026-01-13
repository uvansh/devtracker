import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper to wait for async operations
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

// Mock data generators
export const mockJob = (overrides = {}) => ({
  id: Date.now(),
  company_name: 'Test Company',
  position: 'Software Engineer',
  status: 'applied',
  careers_link: 'https://example.com/careers',
  location: 'Remote',
  salary_range: '$100k - $150k',
  notes: 'Test notes',
  applied_date: '2024-01-15',
  ...overrides,
});

export const mockTodo = (overrides = {}) => ({
  id: Date.now(),
  title: 'Test Todo',
  isCompleted: false,
  priority: 'medium' as const,
  ...overrides,
});

export const mockTechItem = (overrides = {}) => ({
  id: Date.now(),
  name: 'React',
  category: 'Frontend',
  proficiency: 4,
  icon: 'react',
  color: '#61dafb',
  ...overrides,
});

export const mockLeetCodeProblem = (overrides = {}) => ({
  id: Date.now(),
  name: 'Two Sum',
  difficulty: 'Easy' as const,
  category: 'Arrays',
  status: 'solved' as const,
  link: 'https://leetcode.com/problems/two-sum',
  notes: 'Classic problem',
  solved_date: '2024-01-15',
  ...overrides,
});

export const mockProject = (overrides = {}) => ({
  id: Date.now(),
  name: 'Test Project',
  description: 'A test project',
  status: 'in_progress' as const,
  github_link: 'https://github.com/test/project',
  live_link: 'https://test-project.com',
  tech_stack: ['React', 'TypeScript'],
  start_date: '2024-01-01',
  ...overrides,
});
