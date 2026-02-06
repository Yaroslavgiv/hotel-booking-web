import { useUser } from '../context/UserContext';
import { UserProfileModal } from './UserProfileModal';
import { useState } from 'react';
import './UserProfileCard.css';

export const UserProfileCard = () => {
  const { user, logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return (
      <>
        <div className="user-profile-card empty" onClick={() => setIsModalOpen(true)}>
          <div className="profile-icon">👤</div>
          <div className="profile-text">
            <div className="profile-label">Войти в профиль</div>
            <div className="profile-hint">Нажмите, чтобы войти</div>
          </div>
        </div>
        <UserProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="user-profile-card" onClick={() => setIsModalOpen(true)}>
        <div className="profile-icon">👤</div>
        <div className="profile-text">
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
        </div>
        <button
          className="logout-btn"
          onClick={(e) => {
            e.stopPropagation();
            logout();
          }}
          title="Выйти"
        >
          🚪
        </button>
      </div>
      <UserProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
