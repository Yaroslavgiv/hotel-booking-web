import { useState } from 'react';
import { HotelList } from '../components/HotelList';
import { getHeaderBackground } from '../utils/images';
import './HomePage.css';

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const backgroundImage = getHeaderBackground();

  return (
    <div className="home-page">
      <div 
        className="home-header"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(103, 58, 183, 0.85) 0%, rgba(103, 58, 183, 0.65) 100%), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="home-header-content">
          <div className="home-header-label">Система бронирования</div>
          <h1>Найдите отель для следующей поездки</h1>
        </div>
        <div className="home-header-icon">📍</div>
        <div className="home-header-search">
          <input
            type="text"
            placeholder="Поиск отеля, города..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <HotelList searchQuery={searchQuery} />
    </div>
  );
};
