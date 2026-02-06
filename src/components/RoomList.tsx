import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ROOMS_BY_HOTEL } from '../graphql/queries';
import { RoomCard } from './RoomCard';
import { RoomFilters } from './RoomFilters';
import type { Room } from '../types';
import './RoomList.css';

interface RoomListProps {
  hotelId: string;
}

export const RoomList = ({ hotelId }: RoomListProps) => {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const { loading, error, data } = useQuery(GET_ROOMS_BY_HOTEL, {
    variables: { hotelId },
  });

  if (loading) return <div className="loading">Загрузка номеров...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  const rooms = (data?.roomsByHotel || []) as Room[];
  const displayRooms = filteredRooms.length > 0 ? filteredRooms : rooms;

  return (
    <div className="room-list">
      <h2>Номера отеля</h2>
      {rooms.length > 0 && (
        <RoomFilters rooms={rooms} onFilterChange={setFilteredRooms} />
      )}
      {displayRooms.length === 0 ? (
        <p>Номера не найдены</p>
      ) : (
        <div className="room-grid">
          {displayRooms.map((room: Room) => (
            <RoomCard key={room.id} room={room} hotelId={hotelId} />
          ))}
        </div>
      )}
    </div>
  );
};
