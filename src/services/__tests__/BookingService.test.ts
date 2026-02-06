import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingService } from '../BookingService';
import { apolloClient } from '../../apollo/client';
import type { CreateBookingInput } from '../../types';

// Мокируем Apollo Client
vi.mock('../../apollo/client', () => ({
  apolloClient: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}));

describe('BookingService', () => {
  let bookingService: BookingService;

  beforeEach(() => {
    bookingService = new BookingService();
    vi.clearAllMocks();
  });

  describe('checkAvailability', () => {
    it('проверяет доступность номера', async () => {
      const mockData = {
        checkAvailability: {
          available: true,
          conflictingBookings: [],
        },
      };

      vi.mocked(apolloClient.query).mockResolvedValue({
        data: mockData,
      } as any);

      const result = await bookingService.checkAvailability('1', '2024-12-01', '2024-12-05');

      expect(apolloClient.query).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            roomId: '1',
            checkIn: '2024-12-01',
            checkOut: '2024-12-05',
          },
          fetchPolicy: 'network-only',
        })
      );

      expect(result).toEqual(mockData.checkAvailability);
    });

    it('возвращает конфликтующие бронирования', async () => {
      const mockData = {
        checkAvailability: {
          available: false,
          conflictingBookings: [
            {
              id: 'booking-1',
              guestName: 'Иван Иванов',
              guestEmail: 'ivan@example.com',
              checkIn: '2024-12-01',
              checkOut: '2024-12-03',
              isActive: true,
            },
          ],
        },
      };

      vi.mocked(apolloClient.query).mockResolvedValue({
        data: mockData,
      } as any);

      const result = await bookingService.checkAvailability('1', '2024-12-01', '2024-12-05');

      expect(result.available).toBe(false);
      expect(result.conflictingBookings).toHaveLength(1);
    });
  });

  describe('createBooking', () => {
    it('создает бронирование', async () => {
      const input: CreateBookingInput = {
        roomId: '1',
        guestName: 'Иван Иванов',
        guestEmail: 'ivan@example.com',
        checkIn: '2024-12-01',
        checkOut: '2024-12-05',
      };

      const mockBooking = {
        id: 'booking-1',
        ...input,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      vi.mocked(apolloClient.mutate).mockResolvedValue({
        data: { createBooking: mockBooking },
      } as any);

      const result = await bookingService.createBooking(input);

      expect(apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { input },
        })
      );

      expect(result).toEqual(mockBooking);
    });
  });

  describe('cancelBooking', () => {
    it('отменяет бронирование', async () => {
      const bookingId = 'booking-1';
      const mockCanceledBooking = {
        id: bookingId,
        isActive: false,
      };

      vi.mocked(apolloClient.mutate).mockResolvedValue({
        data: { cancelBooking: mockCanceledBooking },
      } as any);

      const result = await bookingService.cancelBooking(bookingId);

      expect(apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { id: bookingId },
        })
      );

      expect(result).toEqual(mockCanceledBooking);
    });
  });
});
