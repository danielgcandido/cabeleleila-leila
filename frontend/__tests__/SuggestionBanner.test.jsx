import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SuggestionBanner from '../src/components/appointments/SuggestionBanner';

const mockSuggestion = {
  hasSuggestion: true,
  suggestedDate: '2025-06-15',
  message: 'Você já tem um agendamento em 15 de junho de 2025. Sugerimos agendar na mesma data para sua conveniência.',
  occupiedSlots: [],
};

describe('SuggestionBanner', () => {
  it('não renderiza quando hasSuggestion é false', () => {
    const { container } = render(
      <SuggestionBanner suggestion={{ hasSuggestion: false }} onAccept={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza o banner quando hasSuggestion é true', () => {
    render(<SuggestionBanner suggestion={mockSuggestion} onAccept={vi.fn()} />);
    expect(screen.getByText(mockSuggestion.message)).toBeInTheDocument();
  });

  it('chama onAccept com a data sugerida ao clicar no botão', () => {
    const onAccept = vi.fn();
    render(<SuggestionBanner suggestion={mockSuggestion} onAccept={onAccept} />);
    const btn = screen.getByRole('button', { name: /usar/i });
    fireEvent.click(btn);
    expect(onAccept).toHaveBeenCalledWith('2025-06-15');
  });

  it('fecha o banner ao clicar no X', () => {
    render(<SuggestionBanner suggestion={mockSuggestion} onAccept={vi.fn()} />);
    const closeBtn = screen.getAllByRole('button').find((b) => !b.textContent.includes('Usar'));
    fireEvent.click(closeBtn);
    expect(screen.queryByText(mockSuggestion.message)).not.toBeInTheDocument();
  });

  it('não renderiza quando suggestion é null', () => {
    const { container } = render(<SuggestionBanner suggestion={null} onAccept={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
