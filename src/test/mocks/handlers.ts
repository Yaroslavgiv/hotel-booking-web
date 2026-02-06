import { graphql } from 'msw';

export const handlers = [
  // Mock для GET_HOTELS
  graphql.query('GetHotels', (req, res, ctx) => {
    return res(
      ctx.data({
        hotels: [
          {
            id: '1',
            name: 'Тестовый отель',
            address: 'Тестовый адрес',
            description: 'Описание отеля',
            rooms: [
              {
                id: '1',
                number: '101',
                type: 'Стандарт',
                price: 3000,
              },
            ],
          },
        ],
      })
    );
  }),

  // Mock для GET_HOTEL
  graphql.query('GetHotel', (req, res, ctx) => {
    return res(
      ctx.data({
        hotel: {
          id: req.variables.id,
          name: 'Тестовый отель',
          address: 'Тестовый адрес',
          description: 'Описание отеля',
          rooms: [
            {
              id: '1',
              number: '101',
              type: 'Стандарт',
              price: 3000,
            },
          ],
        },
      })
    );
  }),

  // Mock для CHECK_AVAILABILITY
  graphql.query('CheckAvailability', (req, res, ctx) => {
    return res(
      ctx.data({
        checkAvailability: {
          available: true,
          conflictingBookings: [],
        },
      })
    );
  }),

  // Mock для CREATE_BOOKING
  graphql.mutation('CreateBooking', (req, res, ctx) => {
    return res(
      ctx.data({
        createBooking: {
          id: 'booking-1',
          guestName: req.variables.input.guestName,
          guestEmail: req.variables.input.guestEmail,
          checkIn: req.variables.input.checkIn,
          checkOut: req.variables.input.checkOut,
          roomId: req.variables.input.roomId,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Mock для CANCEL_BOOKING
  graphql.mutation('CancelBooking', (req, res, ctx) => {
    return res(
      ctx.data({
        cancelBooking: {
          id: req.variables.id,
          isActive: false,
        },
      })
    );
  }),
];
