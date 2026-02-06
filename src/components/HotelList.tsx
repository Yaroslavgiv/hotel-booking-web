import { useQuery } from '@apollo/client';
import { GET_HOTELS } from '../graphql/queries';
import { HotelCard } from './HotelCard';
import './HotelList.css';

interface HotelListProps {
  searchQuery?: string;
}

export const HotelList = ({ searchQuery = '' }: HotelListProps) => {
  const { loading, error, data } = useQuery(GET_HOTELS);

  if (loading) return <div className="loading">Загрузка отелей...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  const hotels = data?.hotels || [];
  const filteredHotels = searchQuery
    ? hotels.filter((hotel: any) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hotel.description && hotel.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : hotels;

  return (
    <div className="hotel-list">
      <h1>Список отелей</h1>
      {filteredHotels.length === 0 ? (
        <p>Отели не найдены</p>
      ) : (
        <div className="hotel-grid">
          {filteredHotels.map((hotel: any) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};
