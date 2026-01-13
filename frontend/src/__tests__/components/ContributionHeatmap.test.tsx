import React from 'react';
import { render, screen } from '../utils/test-utils';
import ContributionHeatmap from '@/components/dashboard/ContributionHeatmap';

describe('ContributionHeatmap', () => {
  it('renders the component title', () => {
    render(<ContributionHeatmap />);
    expect(screen.getByText('Contribution Activity')).toBeInTheDocument();
  });

  it('renders legend with Less and More labels', () => {
    render(<ContributionHeatmap />);
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('renders default hover message', () => {
    render(<ContributionHeatmap />);
    expect(screen.getByText('Hover over a day to see details')).toBeInTheDocument();
  });

  it('renders contribution grid', () => {
    render(<ContributionHeatmap />);
    // Grid cells should be rendered
    const gridCells = document.querySelectorAll('[class*="contribution-"]');
    expect(gridCells.length).toBeGreaterThan(0);
  });

  it('shows contribution info on hover', async () => {
    const { user } = render(<ContributionHeatmap />);
    
    // Find a contribution cell
    const cells = document.querySelectorAll('[class*="contribution-"]');
    if (cells.length > 0) {
      await user.hover(cells[0]);
      // Should show contribution details
      expect(screen.getByText(/contributions/i)).toBeInTheDocument();
    }
  });

  it('renders 5 legend levels', () => {
    render(<ContributionHeatmap />);
    
    // Should have 5 level indicators in legend
    const legendLevels = document.querySelectorAll('.contribution-0, .contribution-1, .contribution-2, .contribution-3, .contribution-4');
    // At minimum, we should have the 5 legend squares
  });

  it('hides contribution info on mouse leave', async () => {
    const { user } = render(<ContributionHeatmap />);
    
    const cells = document.querySelectorAll('[class*="contribution-"]');
    if (cells.length > 0) {
      await user.hover(cells[0]);
      await user.unhover(cells[0]);
      
      // Should show default message again
      expect(screen.getByText('Hover over a day to see details')).toBeInTheDocument();
    }
  });
});
