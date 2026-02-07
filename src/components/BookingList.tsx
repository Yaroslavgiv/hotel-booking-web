import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CANCEL_BOOKING } from '../graphql/mutations';
import { GET_ROOMS } from '../graphql/queries';
import { BookingService } from '../services/BookingService';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import type { Booking, Room } from '../types';
import './BookingList.css';

interface BookingListProps {
  roomId: string;
  room?: Room;
}

export const BookingList = ({ roomId, room }: BookingListProps) => {
  const { showToast } = useToast();
  const { user } = useUser();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [conflictingBookings, setConflictingBookings] = useState<Booking[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const [cancelBookingMutation] = useMutation(CANCEL_BOOKING);
  const bookingService = new BookingService();

  // Проверяем, принадлежит ли бронирование текущему пользователю
  const isUserBooking = (booking: Booking) => {
    return user && booking.guestEmail.toLowerCase() === user.email.toLowerCase();
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      showToast('Заполните даты заезда и выезда', 'error');
      return;
    }

    setIsChecking(true);
    try {
      const result = await bookingService.checkAvailability(roomId, checkIn, checkOut);
      setConflictingBookings(result.conflictingBookings);
      if (result.available) {
        showToast('Номер доступен на указанные даты!', 'success');
      }
    } catch (err: any) {
      showToast('Ошибка при проверке доступности: ' + err.message, 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }

    try {
      await cancelBookingMutation({
        variables: { id: bookingId },
        refetchQueries: [{ query: GET_ROOMS }],
      });
      showToast('Бронирование успешно отменено', 'success');
      // Обновляем проверку доступности, если были указаны даты
      if (checkIn && checkOut) {
        handleCheckAvailability();
      }
    } catch (err: any) {
      showToast('Ошибка при отмене бронирования: ' + err.message, 'error');
    }
  };

  // Устанавливаем даты по умолчанию (сегодня и через месяц)
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="booking-list">
      <h2>Бронирования номера {room?.number || roomId}</h2>
      {room && (
        <div className="room-info">
          <p>Тип: {room.type}</p>
          <p>Цена: {room.price} ₽/ночь</p>
          {room.hotel && <p>Отель: {room.hotel.name}</p>}
        </div>
      )}

      <div className="availability-check">
        <h3>Проверка доступности и просмотр броней</h3>
        <p className="info-text">
          Введите диапазон дат для проверки доступности номера. Если номер занят, будут показаны конфликтующие бронирования.
        </p>
        <div className="date-inputs">
          <div className="form-group">
            <label>Дата заезда:</label>
            <input
              type="date"
              value={checkIn || today}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
            />
          </div>
          <div className="form-group">
            <label>Дата выезда:</label>
            <input
              type="date"
              value={checkOut || nextMonth}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
            />
          </div>
          <button
            onClick={handleCheckAvailability}
            disabled={isChecking || !checkIn || !checkOut}
            className="check-button"
          >
            {isChecking ? 'Проверка...' : 'Проверить доступность'}
          </button>
        </div>

        {conflictingBookings.length > 0 && checkIn && checkOut && (
          <div className="conflicting-bookings">
            <h4>Конфликтующие бронирования на указанный период ({conflictingBookings.length}):</h4>
            <div className="bookings-grid">
              {conflictingBookings
                .filter((booking) => booking.isActive)
                .map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <strong>{booking.guestName}</strong>
                      {booking.isActive && isUserBooking(booking) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="cancel-button"
                        >
                          Отменить
                        </button>
                      )}
                    </div>
                    <p>Email: {booking.guestEmail}</p>
                    <p>Заезд: {new Date(booking.checkIn).toLocaleDateString('ru-RU')}</p>
                    <p>Выезд: {new Date(booking.checkOut).toLocaleDateString('ru-RU')}</p>
                    <p className={booking.isActive ? 'status-active' : 'status-cancelled'}>
                      {booking.isActive ? 'Активно' : 'Отменено'}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
