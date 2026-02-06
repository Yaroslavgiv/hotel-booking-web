// Типы для GraphQL схемы
export interface Hotel {
  id: string;
  name: string;
  address: string;
  description?: string;
  rooms?: Room[];
}

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  hotelId: string;
  hotel?: Hotel;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  roomId: string;
  room?: Room;
  isActive: boolean;
  createdAt: string;
}

export interface AvailabilityResult {
  available: boolean;
  conflictingBookings: Booking[];
}

export interface CreateBookingInput {
  roomId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
}
