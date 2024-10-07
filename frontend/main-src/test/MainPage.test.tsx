import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppContextTheme } from '../store/context/AppContext';
import SideMenu from '../main-components/SideMenu/SideMenu';
import { QuestionInput } from '../main-components/QuestionInput/QuestionInput';
import { describe, expect, it, vi, assert } from 'vitest';

const mockContextValue = {
  isDarkMode: false,
  setIsDarkMode: vi.fn(),
};

const renderComponent = (isOpen = true, toggleMenu = vi.fn()) => {
  const defaultProps = {
    onSend: vi.fn(),
    onMicrophoneClick: vi.fn(),
    toggleDropdown: vi.fn(),
    onStopClick: vi.fn(),
    disabled: false,
    placeholder: 'Ask a question...',
    clearOnSend: true,
    recognizedText: '',
    isListening: false,
    isRecognizing: false,
    setRecognizedText: vi.fn(),
  };
  render(
    <AppContextTheme.Provider value={mockContextValue}>
      <SideMenu isOpen={isOpen} toggleMenu={toggleMenu} />
      <QuestionInput {...defaultProps} />
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

describe('QuestionInput Component', () => {
  it('renders the textarea', () => {
    renderComponent();
    const textarea = screen.getAllByTestId('question-textarea')[0];
    assert.isNotNull(textarea);
  });

  it('allows input text change in the textarea', () => {
    renderComponent();
    const textarea = screen.getAllByTestId('question-textarea')[0] as HTMLTextAreaElement; // Cast to HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: 'Test question' } });

    assert.equal(textarea.value, 'Test question');
  });

});