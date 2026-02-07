import { useState, useEffect, useRef } from 'react';
import { BookingService } from '../services/BookingService';
import type { Booking } from '../types';
import './UnavailableDates.css';

interface UnavailableDatesProps {
  roomId: string;
}

export const UnavailableDates = ({ roomId }: UnavailableDatesProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const bookingServiceRef = useRef(new BookingService());

  useEffect(() => {
    loadUnavailableDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const loadUnavailableDates = async () => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Используем прямой запрос для получения всех активных бронирований номера
      // Это более эффективно, чем checkAvailability с широким диапазоном дат
      console.log(`[UnavailableDates] Загрузка бронирований для номера ${roomId}`);

      const activeBookings = await bookingServiceRef.current.getBookingsByRoom(roomId);
      
      console.log(`[UnavailableDates] Получено активных бронирований: ${activeBookings.length}`);
      
      // Фильтруем только активные бронирования (на всякий случай, хотя бэкенд уже возвращает только активные)
      const filteredBookings = activeBookings.filter(
        (booking) => booking.isActive === true
      );
      
      // Сортируем по дате заезда
      filteredBookings.sort((a, b) => 
        new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
      );
      
      setBookings(filteredBookings);
    } catch (err) {
      console.error('Ошибка при загрузке недоступных дат:', err);
      setBookings([]);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="unavailable-dates">
        <h3>Недоступные даты</h3>
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="unavailable-dates">
        <h3>Недоступные даты</h3>
        <div className="no-bookings">Нет активных бронирований</div>
      </div>
    );
  }

  return (
    <div className="unavailable-dates">
      <h3>Недоступные диапазоны дат</h3>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-range">
            <div className="booking-dates">
              <span className="date-label">С:</span>
              <span className="date-value">{formatDate(booking.checkIn)}</span>
              <span className="date-separator">—</span>
              <span className="date-label">По:</span>
              <span className="date-value">{formatDate(booking.checkOut)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
