import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Hotel } from '../types';
import { getHotelImage } from '../utils/images';
import './HotelCard.css';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const roomsCount = hotel.rooms?.length || 0;
  const [imageError, setImageError] = useState(false);
  const imageUrl = getHotelImage(hotel.id);

  return (
    <Link to={`/hotel/${hotel.id}`} className="hotel-card">
      <div 
        className="hotel-card-header"
        style={{
          backgroundImage: !imageError ? `linear-gradient(135deg, rgba(103, 58, 183, 0.85) 0%, rgba(103, 58, 183, 0.65) 100%), url(${imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt={hotel.name}
          className="hotel-card-image"
          onError={() => setImageError(true)}
          style={{ display: 'none' }}
        />
        <h2>{hotel.name}</h2>
        <p className="address">{hotel.address}</p>
      </div>
      <div className="hotel-card-content">
        {hotel.description && <p className="description">{hotel.description}</p>}
        <p className="rooms-count">Номеров: {roomsCount}</p>
      </div>
      <div className="hotel-card-footer">
        <span className="hotel-card-badge">Рекомендуем</span>
        <span className="view-link">Смотреть номера</span>
      </div>
    </Link>
  );
};
