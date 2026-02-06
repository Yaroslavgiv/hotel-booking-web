import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './UserProfileModal.css';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {
  const { user, setUser } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Введите имя');
      return;
    }

    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email');
      return;
    }

    setUser({ name: name.trim(), email: email.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Профиль пользователя</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Имя:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="save-button">
              Сохранить
            </button>
            {user && (
              <button
                type="button"
                onClick={() => {
                  setUser(null);
                  setName('');
                  setEmail('');
                  onClose();
                }}
                className="logout-button"
              >
                Выйти
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
