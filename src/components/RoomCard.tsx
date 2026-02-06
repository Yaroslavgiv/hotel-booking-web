import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Room } from '../types';
import { getRoomImage } from '../utils/images';
import './RoomCard.css';

interface RoomCardProps {
  room: Room;
  hotelId: string;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getRoomImage(room.id);

  return (
    <div className="room-card" onClick={() => window.location.href = `/room/${room.id}/book`}>
      <div 
        className="room-card-header"
        style={{
          backgroundImage: !imageError ? `linear-gradient(135deg, rgba(103, 58, 183, 0.85) 0%, rgba(103, 58, 183, 0.65) 100%), url(${imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt={`Номер ${room.number}`}
          className="room-card-image"
          onError={() => setImageError(true)}
          style={{ display: 'none' }}
        />
        <h3>Номер {room.number}</h3>
        <p className="room-type">{room.type}</p>
      </div>
      <div className="room-card-content">
        <div className="room-card-price">
          <span className="room-card-price-value">{Math.round(room.price)} ₽</span>
          <span className="room-card-price-label">за ночь</span>
        </div>
        <Link to={`/room/${room.id}/book`} className="book-link" onClick={(e) => e.stopPropagation()}>
          Выбрать
        </Link>
      </div>
    </div>
  );
};
