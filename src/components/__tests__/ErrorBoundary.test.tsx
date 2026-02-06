import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { ErrorBoundary } from '../ErrorBoundary';
import React from 'react';

// Компонент, который выбрасывает ошибку
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Тестовая ошибка');
  }
  return <div>Все хорошо</div>;
};

describe('ErrorBoundary', () => {
  it('отображает дочерние компоненты без ошибок', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Все хорошо')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке при ошибке рендеринга', () => {
    // Подавляем вывод ошибки в консоль для теста
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();
    expect(screen.getByText(/Произошла ошибка при загрузке страницы/i)).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('отображает кнопку для возврата на главную', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Вернуться на главную/i)).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
