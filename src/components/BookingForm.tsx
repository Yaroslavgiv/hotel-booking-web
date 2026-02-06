import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOOKING } from '../graphql/mutations';
import { GET_ROOMS } from '../graphql/queries';
import { BookingService } from '../services/BookingService';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import './BookingForm.css';

interface BookingFormProps {
  roomId: string;
  onSuccess?: () => void;
  onBookingCreated?: (email: string) => void;
}

export const BookingForm = ({ roomId, onSuccess, onBookingCreated }: BookingFormProps) => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    // Автозаполнение из профиля пользователя
    if (user) {
      setGuestName(user.name);
      setGuestEmail(user.email);
    }
  }, [user]);

  const [createBooking, { loading }] = useMutation(CREATE_BOOKING);

  const bookingService = new BookingService();

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      setError('Заполните даты заезда и выезда');
      return;
    }

    setCheckingAvailability(true);
    setError(null);

    try {
      const result = await bookingService.checkAvailability(roomId, checkIn, checkOut);
      if (!result.available) {
        setError(
          `Номер недоступен на указанные даты. Найдено ${result.conflictingBookings.length} конфликтующих бронирований.`
        );
      } else {
        setError(null);
        showToast('Номер доступен на указанные даты!', 'success');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при проверке доступности');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!guestName || !guestEmail || !checkIn || !checkOut) {
      setError('Заполните все поля');
      return;
    }

    try {
      await createBooking({
        variables: {
          input: {
            roomId,
            guestName,
            guestEmail,
            checkIn,
            checkOut,
          },
        },
        refetchQueries: [{ query: GET_ROOMS }],
      });

      showToast('Бронирование успешно создано!', 'success');
      const email = guestEmail;
      setGuestName('');
      setGuestEmail('');
      setCheckIn('');
      setCheckOut('');
      if (onBookingCreated) onBookingCreated(email);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании бронирования');
    }
  };

  return (
    <div className="booking-form">
      <h2>Создать бронирование</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя гостя:</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email гостя:</label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Даты пребывания:</label>
          <div className="date-range-inputs">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              placeholder="Дата заезда"
            />
            <span className="date-separator">—</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              required
              placeholder="Дата выезда"
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={checkingAvailability || !checkIn || !checkOut}
            className="check-button"
          >
            {checkingAvailability ? 'Проверка...' : 'Проверить доступность'}
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Создание...' : 'Создать бронирование'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};
