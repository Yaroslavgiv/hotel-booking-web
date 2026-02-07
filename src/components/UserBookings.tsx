import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CANCEL_BOOKING } from '../graphql/mutations';
import { GET_ROOMS } from '../graphql/queries';
import { BookingService } from '../services/BookingService';
import { useToast } from '../context/ToastContext';
import type { Booking } from '../types';
import './UserBookings.css';

interface UserBookingsProps {
  roomId: string;
  userEmail: string;
  onRefresh?: () => void;
}

export const UserBookings = ({ roomId, userEmail, onRefresh }: UserBookingsProps) => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [cancelBookingMutation] = useMutation(CANCEL_BOOKING);

  useEffect(() => {
    if (userEmail) {
      loadUserBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userEmail]);

  const loadUserBookings = async () => {
    setLoading(true);
    try {
      const bookingService = new BookingService();
      // Используем прямой запрос для получения всех активных бронирований номера
      const allBookings = await bookingService.getBookingsByRoom(roomId);
      
      // Фильтруем только бронирования текущего пользователя
      const userBookings = allBookings.filter(
        (booking) => 
          booking.isActive && 
          booking.guestEmail.toLowerCase() === userEmail.toLowerCase()
      );
      
      setBookings(userBookings);
    } catch (err) {
      console.error('Ошибка при загрузке броней пользователя:', err);
      setBookings([]);
    } finally {
      setLoading(false);
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
      loadUserBookings();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast('Ошибка при отмене бронирования: ' + err.message, 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!userEmail) {
    return null;
  }

  if (loading) {
    return (
      <div className="user-bookings">
        <h3>Мои бронирования</h3>
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="user-bookings">
        <h3>Мои бронирования</h3>
        <div className="no-bookings">У вас нет активных бронирований в этом номере</div>
      </div>
    );
  }

  return (
    <div className="user-bookings">
      <h3>Мои бронирования</h3>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-item">
            <div className="booking-dates">
              <span className="date-label">С:</span>
              <span className="date-value">{formatDate(booking.checkIn)}</span>
              <span className="date-separator">—</span>
              <span className="date-label">По:</span>
              <span className="date-value">{formatDate(booking.checkOut)}</span>
            </div>
            {booking.guestName && (
              <div className="booking-guest">Гость: {booking.guestName}</div>
            )}
            <button
              onClick={() => handleCancelBooking(booking.id)}
              className="cancel-button"
            >
              Отменить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
