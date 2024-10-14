import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppContextTheme } from '../store/context/AppContext';
import SideMenu from '../main-components/SideMenu/SideMenu';
import { describe, expect, it, vi } from 'vitest';

const mockContextValue = {
  isDarkMode: false,
  setIsDarkMode: vi.fn(),
};

const renderComponent = (isOpen = true, toggleMenu = vi.fn()) => {
  render(
    <AppContextTheme.Provider value={mockContextValue}>
      <SideMenu isOpen={isOpen} toggleMenu={toggleMenu} />
    </AppContextTheme.Provider>,
  );
};

describe('SideMenu Component', () => {
  it('calls setIsDarkMode on light and dark mode buttons', () => {
    renderComponent();

    const lightButton = screen.getByText(/Light/i);
    const darkButton = screen.getByText(/Dark/i);

    fireEvent.click(lightButton);
    expect(mockContextValue.setIsDarkMode).toHaveBeenCalledWith(true);

    fireEvent.click(darkButton);
    expect(mockContextValue.setIsDarkMode).toHaveBeenCalledWith(false);
  });

  it('calls closeMenu when the close button is clicked', () => {
    const toggleMenu = vi.fn();
    renderComponent(true, toggleMenu);

    const closeButtons = screen.getAllByTestId('minimize-sidebar');

    fireEvent.click(closeButtons[closeButtons.length - 1]); // Click the last one, or adjust as needed

    expect(toggleMenu).toHaveBeenCalledTimes(1);
  });
});
