import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { HotelCard } from '../HotelCard';
import type { Hotel } from '../../types';

describe('HotelCard', () => {
  const mockHotel: Hotel = {
    id: '1',
    name: 'Тестовый отель',
    address: 'Тестовый адрес, 123',
    description: 'Описание отеля',
    rooms: [
      { id: '1', number: '101', type: 'Стандарт', price: 3000, hotelId: '1' },
      { id: '2', number: '102', type: 'Люкс', price: 5000, hotelId: '1' },
    ],
  };

  it('отображает информацию об отеле', () => {
    render(<HotelCard hotel={mockHotel} />);

    expect(screen.getByText(mockHotel.name)).toBeInTheDocument();
    expect(screen.getByText(mockHotel.address)).toBeInTheDocument();
    expect(screen.getByText(mockHotel.description!)).toBeInTheDocument();
  });

  it('отображает количество номеров', () => {
    render(<HotelCard hotel={mockHotel} />);

    expect(screen.getByText(/Номеров: 2/i)).toBeInTheDocument();
  });

  it('отображает ссылку на страницу отеля', () => {
    render(<HotelCard hotel={mockHotel} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/hotel/1');
  });

  it('работает без описания', () => {
    const hotelWithoutDescription = { ...mockHotel, description: undefined };
    render(<HotelCard hotel={hotelWithoutDescription} />);

    expect(screen.getByText(mockHotel.name)).toBeInTheDocument();
    expect(screen.queryByText(mockHotel.description!)).not.toBeInTheDocument();
  });

  it('работает без номеров', () => {
    const hotelWithoutRooms = { ...mockHotel, rooms: undefined };
    render(<HotelCard hotel={hotelWithoutRooms} />);

    expect(screen.getByText(mockHotel.name)).toBeInTheDocument();
    expect(screen.getByText(/Номеров: 0/i)).toBeInTheDocument();
  });
});
