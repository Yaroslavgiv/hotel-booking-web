import { gql } from '@apollo/client';

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      guestName
      guestEmail
      checkIn
      checkOut
      roomId
      room {
        id
        number
        type
        price
        hotel {
          id
          name
        }
      }
      isActive
      createdAt
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      guestName
      guestEmail
      checkIn
      checkOut
      roomId
      room {
        id
        number
        type
        hotel {
          id
          name
        }
      }
      isActive
      createdAt
    }
  }
`;
