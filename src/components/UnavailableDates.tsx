import { useState, useEffect } from 'react';
import { BookingService } from '../services/BookingService';
import type { Booking } from '../types';
import './UnavailableDates.css';

interface UnavailableDatesProps {
  roomId: string;
}

export const UnavailableDates = ({ roomId }: UnavailableDatesProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnavailableDates();
  }, [roomId]);

  const loadUnavailableDates = async () => {
    setLoading(true);
    try {
      const bookingService = new BookingService();
      // Используем широкий диапазон дат для получения всех активных броней
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);

      const checkIn = today.toISOString().split('T')[0];
      const checkOut = nextYear.toISOString().split('T')[0];

      const result = await bookingService.checkAvailability(roomId, checkIn, checkOut);
      
      // Фильтруем только активные бронирования
      const activeBookings = result.conflictingBookings.filter(
        (booking) => booking.isActive
      );
      
      setBookings(activeBookings);
    } catch (err) {
      console.error('Ошибка при загрузке недоступных дат:', err);
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
