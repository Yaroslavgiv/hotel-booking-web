import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';

// Компонент для тестирования контекста
const TestComponent = () => {
  const { user, setUser, logout } = useUser();

  return (
    <div>
      <div data-testid="user-name">{user?.name || 'Нет пользователя'}</div>
      <div data-testid="user-email">{user?.email || 'Нет email'}</div>
      <button onClick={() => setUser({ name: 'Тест', email: 'test@test.com' })}>
        Установить пользователя
      </button>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('предоставляет пустого пользователя по умолчанию', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('user-name')).toHaveTextContent('Нет пользователя');
    expect(screen.getByTestId('user-email')).toHaveTextContent('Нет email');
  });

  it('позволяет установить пользователя', async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setUserButton = screen.getByText('Установить пользователя');
    await act(async () => {
      await user.click(setUserButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Тест');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@test.com');
    });
  });

  it('сохраняет пользователя в localStorage', async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setUserButton = screen.getByText('Установить пользователя');
    await act(async () => {
      await user.click(setUserButton);
    });

    await waitFor(() => {
      const savedUser = localStorage.getItem('user');
      expect(savedUser).toBeTruthy();
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        expect(parsed.name).toBe('Тест');
        expect(parsed.email).toBe('test@test.com');
      }
    });
  });

  it('позволяет выйти из системы', async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Сначала устанавливаем пользователя
    const setUserButton = screen.getByText('Установить пользователя');
    await act(async () => {
      await user.click(setUserButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Тест');
    });

    // Затем выходим
    const logoutButton = screen.getByText('Выйти');
    await act(async () => {
      await user.click(logoutButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Нет пользователя');
    });
  });
});
