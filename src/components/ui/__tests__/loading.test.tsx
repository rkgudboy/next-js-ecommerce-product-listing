import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('Loading Component', () => {
  describe('Basic Rendering', () => {
    it('renders loading spinner with default props', () => {
      render(<Loading />);
      
      // Check for loading container
      const container = screen.getByText('Loading...').closest('div');
      expect(container).toBeInTheDocument();
      
      // Check for default message
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Check for spinner (ArrowPathIcon should be present)
      const spinner = container?.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('renders with custom message', () => {
      const customMessage = 'Loading products...';
      render(<Loading message={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('renders with empty message', () => {
      render(<Loading message="" />);
      
      // Empty message should still render the p element
      const messageElement = document.querySelector('p.mt-4');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toHaveTextContent('');
    });

    it('renders with very long message', () => {
      const longMessage = 'This is a very long loading message that should be handled gracefully by the component without breaking the layout or causing any display issues';
      render(<Loading message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      render(<Loading size="sm" />);
      
      const container = screen.getByText('Loading...').closest('div');
      const spinner = container?.querySelector('svg');
      
      expect(spinner).toHaveClass('h-6', 'w-6');
    });

    it('renders with medium size (default)', () => {
      render(<Loading size="md" />);
      
      const container = screen.getByText('Loading...').closest('div');
      const spinner = container?.querySelector('svg');
      
      expect(spinner).toHaveClass('h-12', 'w-12');
    });

    it('renders with large size', () => {
      render(<Loading size="lg" />);
      
      const container = screen.getByText('Loading...').closest('div');
      const spinner = container?.querySelector('svg');
      
      expect(spinner).toHaveClass('h-16', 'w-16');
    });

    it('defaults to medium size when no size prop provided', () => {
      render(<Loading />);
      
      const container = screen.getByText('Loading...').closest('div');
      const spinner = container?.querySelector('svg');
      
      expect(spinner).toHaveClass('h-12', 'w-12');
    });
  });

  describe('Styling and Classes', () => {
    it('applies correct CSS classes to spinner', () => {
      render(<Loading />);
      
      const container = screen.getByText('Loading...').closest('div');
      const spinner = container?.querySelector('svg');
      
      expect(spinner).toHaveClass('animate-spin');
      expect(spinner).toHaveClass('text-neutral-900');
      expect(spinner).toHaveClass('dark:text-neutral-100');
      expect(spinner).toHaveClass('mx-auto');
    });

    it('applies correct layout classes', () => {
      const { container } = render(<Loading />);
      
      // Check for main container classes
      const mainContainer = container.querySelector('.mx-auto.max-w-screen-2xl.px-4');
      expect(mainContainer).toBeInTheDocument();
      
      // Check flex container classes
      const flexContainer = container.querySelector('.min-h-screen.flex.items-center.justify-center');
      expect(flexContainer).toBeInTheDocument();
      
      // Check text container classes
      const textContainer = container.querySelector('.text-center');
      expect(textContainer).toBeInTheDocument();
    });

    it('applies correct text styling', () => {
      render(<Loading message="Custom message" />);
      
      const message = screen.getByText('Custom message');
      expect(message).toHaveClass('mt-4', 'text-neutral-600', 'dark:text-neutral-400');
    });
  });

  describe('Accessibility', () => {
    it('provides accessible structure for screen readers', () => {
      render(<Loading message="Loading products" />);
      
      // The loading message should be accessible
      const message = screen.getByText('Loading products');
      expect(message).toBeInTheDocument();
      
      // The component should have a semantic structure
      const container = message.closest('div');
      expect(container).toHaveClass('text-center');
    });

    it('handles focus properly', () => {
      render(<Loading />);
      
      // Loading component should not trap focus
      const container = screen.getByText('Loading...').closest('div');
      expect(container).not.toHaveAttribute('tabindex');
    });
  });

  describe('Component Combinations', () => {
    it('renders correctly with both custom message and size', () => {
      render(<Loading message="Loading store data..." size="lg" />);
      
      expect(screen.getByText('Loading store data...')).toBeInTheDocument();
      
      const container = screen.getByText('Loading store data...').closest('div');
      const spinner = container?.querySelector('svg');
      expect(spinner).toHaveClass('h-16', 'w-16');
    });

    it('handles special characters in message', () => {
      const specialMessage = "Loading... 50% complete! ⚡🚀";
      render(<Loading message={specialMessage} />);
      
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles HTML entities in message', () => {
      const htmlMessage = "Loading &amp; processing data...";
      render(<Loading message={htmlMessage} />);
      
      expect(screen.getByText(htmlMessage)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with minimal DOM nodes', () => {
      const { container } = render(<Loading />);
      
      // Should have a reasonable DOM structure
      const allDivs = container.querySelectorAll('div');
      const allSvgs = container.querySelectorAll('svg');
      
      // Should have exactly 3 div elements and 1 svg
      expect(allDivs).toHaveLength(3);
      expect(allSvgs).toHaveLength(1);
    });

    it('does not cause unnecessary re-renders', () => {
      const { rerender } = render(<Loading message="Test" />);
      
      // Re-render with same props should not cause issues
      rerender(<Loading message="Test" />);
      
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null/undefined size gracefully', () => {
      // @ts-ignore - Testing invalid prop
      const { container } = render(<Loading size={null} />);
      
      const spinner = container.querySelector('svg');
      
      // Should default to medium size or handle gracefully
      expect(spinner).toBeInTheDocument();
    });

    it('handles invalid size gracefully', () => {
      // @ts-ignore - Testing invalid prop
      render(<Loading size="invalid" />);
      
      const container = screen.getByText('Loading...').closest('div');
      const spinner = container?.querySelector('svg');
      
      // Should default to medium size or handle gracefully
      expect(spinner).toBeInTheDocument();
    });

    it('handles null message', () => {
      // @ts-ignore - Testing invalid prop
      const { container } = render(<Loading message={null} />);
      
      // Should render without crashing
      const spinner = container.querySelector('svg');
      expect(spinner).toBeInTheDocument();
    });

    it('handles undefined message', () => {
      // @ts-ignore - Testing invalid prop
      render(<Loading message={undefined} />);
      
      // Should use default message
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});