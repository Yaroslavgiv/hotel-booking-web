import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ROOMS } from '../graphql/queries';
import { BookingList } from '../components/BookingList';
import { getRoomImage } from '../utils/images';
import './BookingsViewPage.css';
import './BookingPage.css';

export const BookingsViewPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ROOMS);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  const room = data?.rooms?.find((r: any) => r.id === roomId);

  const imageUrl = room ? getRoomImage(room.id) : '';

  return (
    <div className="bookings-view-page">
      {room && (
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
      )}
      <div className={room ? "room-details" : ""}>
        <BookingList roomId={roomId!} room={room} />
      </div>
    </div>
  );
};
