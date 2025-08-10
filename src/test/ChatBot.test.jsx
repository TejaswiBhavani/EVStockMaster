import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../components/Chat/ChatBot.jsx';

// Mock fetch to simulate network behavior
global.fetch = vi.fn();

describe('ChatBot API Integration', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the ChatBot component', () => {
    render(<ChatBot />);
    // ChatBot starts closed, so we look for the toggle button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the chat window when clicked', async () => {
    render(<ChatBot />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('InvenAI Assistant')).toBeInTheDocument();
    });
  });

  it('handles API failure gracefully with fallback responses', async () => {
    fetch.mockRejectedValue(new Error('Network error'));
    
    render(<ChatBot />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('InvenAI Assistant')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Ask about inventory, parts, or analytics...');
    const sendButton = screen.getByLabelText('Send message');
    
    fireEvent.change(input, { target: { value: 'battery status' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Battery Pack Analysis/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('calls the proxy endpoint with correct parameters when API is available', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Mocked AI response' })
    });
    
    render(<ChatBot />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('InvenAI Assistant')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Ask about inventory, parts, or analytics...');
    const sendButton = screen.getByLabelText('Send message');
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: expect.stringContaining('test message'),
          system: 'You are InvenAI, an EV inventory assistant.'
        })
      });
    });
  });
});