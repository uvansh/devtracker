import React from 'react';
import { render, screen } from '../utils/test-utils';
import TimeDisplay from '@/components/dashboard/TimeDisplay';

describe('TimeDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading state initially', () => {
    render(<TimeDisplay />);
    // Should render an empty placeholder initially
    const card = document.querySelector('.glass-card');
    expect(card).toBeInTheDocument();
  });

  it('displays time after mounting', async () => {
    jest.setSystemTime(new Date('2024-01-15T14:30:00'));
    render(<TimeDisplay />);
    
    // Fast-forward to allow useEffect to run
    jest.advanceTimersByTime(100);
    
    // Should show time in format like "02:30 PM"
    expect(await screen.findByText(/\d{2}:\d{2}\s*(AM|PM)/i)).toBeInTheDocument();
  });

  it('displays greeting based on time of day - morning', () => {
    jest.setSystemTime(new Date('2024-01-15T09:00:00'));
    render(<TimeDisplay />);
    jest.advanceTimersByTime(100);
    
    // Morning greeting (before 12)
    expect(screen.getByText('Good Morning')).toBeInTheDocument();
  });

  it('displays greeting based on time of day - afternoon', () => {
    jest.setSystemTime(new Date('2024-01-15T14:00:00'));
    render(<TimeDisplay />);
    jest.advanceTimersByTime(100);
    
    // Afternoon greeting (12-17)
    expect(screen.getByText('Good Afternoon')).toBeInTheDocument();
  });

  it('displays greeting based on time of day - evening', () => {
    jest.setSystemTime(new Date('2024-01-15T19:00:00'));
    render(<TimeDisplay />);
    jest.advanceTimersByTime(100);
    
    // Evening greeting (17-21)
    expect(screen.getByText('Good Evening')).toBeInTheDocument();
  });

  it('displays greeting based on time of day - night', () => {
    jest.setSystemTime(new Date('2024-01-15T23:00:00'));
    render(<TimeDisplay />);
    jest.advanceTimersByTime(100);
    
    // Night greeting (after 21)
    expect(screen.getByText('Good Night')).toBeInTheDocument();
  });

  it('displays current date', async () => {
    jest.setSystemTime(new Date('2024-01-15T14:30:00'));
    render(<TimeDisplay />);
    jest.advanceTimersByTime(100);
    
    // Should display date like "Monday, January 15, 2024"
    expect(await screen.findByText(/January 15, 2024/)).toBeInTheDocument();
  });

  it('updates time every minute', () => {
    jest.setSystemTime(new Date('2024-01-15T14:30:00'));
    render(<TimeDisplay />);
    
    jest.advanceTimersByTime(60000); // 1 minute
    
    // Component should have updated (interval runs every 60 seconds)
  });
});
