import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_HOTEL } from '../graphql/queries';
import { RoomList } from '../components/RoomList';
import { Link } from 'react-router-dom';
import { UserProfileCard } from '../components/UserProfileCard';
import { UserProfileModal } from '../components/UserProfileModal';
import { useUser } from '../context/UserContext';
import { getHotelImage } from '../utils/images';
import './HotelPage.css';

export const HotelPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_HOTEL, {
    variables: { id },
  });

  useEffect(() => {
    // Открываем модальное окно при первом входе, если пользователь не авторизован
    if (!loading && !user) {
      setIsModalOpen(true);
    }
  }, [loading, user]);

  if (loading) return <div className="loading">Загрузка отеля...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;
  if (!data?.hotel) return <div>Отель не найден</div>;

  const hotel = data.hotel;
  const backgroundImage = getHotelImage(hotel.id);

  return (
    <div className="hotel-page">
      <div 
        className="hotel-header"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(103, 58, 183, 0.85) 0%, rgba(103, 58, 183, 0.65) 100%), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Link to="/" className="back-link">← Назад</Link>
        <div className="hotel-header-content">
          <div className="hotel-header-label">Отель</div>
          <h1>{hotel.name}</h1>
          <p className="address">{hotel.address}</p>
        </div>
      </div>
      <div className="hotel-content">
        <UserProfileCard />
        <RoomList hotelId={id!} />
      </div>
      <UserProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
