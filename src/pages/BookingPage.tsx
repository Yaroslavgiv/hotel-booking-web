import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ROOMS } from '../graphql/queries';
import { BookingForm } from '../components/BookingForm';
import { UnavailableDates } from '../components/UnavailableDates';
import { UserBookings } from '../components/UserBookings';
import { UserProfileModal } from '../components/UserProfileModal';
import { useUser } from '../context/UserContext';
import { getRoomImage } from '../utils/images';
import './BookingPage.css';

export const BookingPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [userEmail, setUserEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { loading, error, data, refetch } = useQuery(GET_ROOMS);

  useEffect(() => {
    // Открываем модальное окно при первом входе, если пользователь не авторизован
    if (!loading && !user) {
      setIsModalOpen(true);
    }
  }, [loading, user]);

  useEffect(() => {
    // Обновляем email из профиля пользователя
    if (user) {
      setUserEmail(user.email);
    }
  }, [user]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  const room = data?.rooms?.find((r: any) => r.id === roomId);

  if (!room) return <div>Номер не найден</div>;

  const handleBookingCreated = (email: string) => {
    setUserEmail(email);
  };

  const handleRefresh = () => {
    // Обновляем данные через Apollo Client
    refetch();
    setRefreshKey(prev => prev + 1);
  };

  const imageUrl = getRoomImage(room.id);

  return (
    <div className="booking-page">
      <div 
        className="room-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(103, 58, 183, 0.85) 0%, rgba(103, 58, 183, 0.65) 100%), url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt={`Номер ${room.number}`}
          style={{ display: 'none' }}
        />
        <button onClick={() => navigate(-1)} className="back-button">
          ←
        </button>
        <div className="room-hero-content">
          <h2>Номер {room.number}</h2>
          <p className="room-type">{room.type}</p>
          <span className="room-hero-price">{Math.round(room.price)} ₽ / ночь</span>
        </div>
      </div>
      <div className="room-details">
        <UnavailableDates key={refreshKey} roomId={roomId!} />
        {userEmail && (
          <UserBookings
            key={refreshKey}
            roomId={roomId!}
            userEmail={userEmail}
            onRefresh={handleRefresh}
          />
        )}
        <BookingForm
          roomId={roomId!}
          onSuccess={() => {
            refetch();
            setRefreshKey(prev => prev + 1);
            navigate(`/room/${roomId}/bookings`);
          }}
          onBookingCreated={handleBookingCreated}
        />
      </div>
      <UserProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
