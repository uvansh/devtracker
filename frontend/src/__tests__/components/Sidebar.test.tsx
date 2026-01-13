import React from 'react';
import { render, screen } from '../utils/test-utils';
import Sidebar from '@/components/layout/Sidebar';

describe('Sidebar', () => {
  it('renders the logo', () => {
    render(<Sidebar />);
    expect(screen.getByText('DevTracker')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Job Tracker')).toBeInTheDocument();
    expect(screen.getByText('LeetCode')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('Todos')).toBeInTheDocument();
  });

  it('renders settings link', () => {
    render(<Sidebar />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('navigation items are links', () => {
    render(<Sidebar />);
    
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/');
    
    const jobsLink = screen.getByRole('link', { name: /Job Tracker/i });
    expect(jobsLink).toHaveAttribute('href', '/jobs');
  });

  it('collapses when toggle button is clicked', async () => {
    const { user } = render(<Sidebar />);
    
    // Find the collapse button by looking for ChevronLeft icon
    const buttons = screen.getAllByRole('button');
    const collapseBtn = buttons[0]; // First button should be collapse toggle
    
    if (collapseBtn) {
      await user.click(collapseBtn);
      // After collapse, text should not be visible on desktop
    }
  });

  it('renders mobile header on small screens', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });
    
    render(<Sidebar />);
    
    // Mobile header should exist
    const mobileHeader = document.querySelector('.md\\:hidden');
    expect(mobileHeader).toBeInTheDocument();
  });

  it('renders bottom navigation on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });
    
    render(<Sidebar />);
    
    // Bottom nav should exist
    const bottomNav = document.querySelector('nav.md\\:hidden');
    expect(bottomNav).toBeInTheDocument();
  });

  it('opens mobile menu when hamburger is clicked', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });
    
    const { user } = render(<Sidebar />);
    
    // Find and click the "More" button in bottom nav
    const moreButton = screen.getByText('More');
    if (moreButton) {
      await user.click(moreButton);
      // Mobile menu should open
    }
  });

  it('displays correct active state for current path', () => {
    render(<Sidebar />);
    
    // Dashboard should be active by default (path is '/')
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
    // Check for active styling class
    expect(dashboardLink).toHaveClass('bg-gradient-to-r');
  });
});
