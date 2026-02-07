import { gql } from '@apollo/client';

export const GET_HOTELS = gql`
  query GetHotels {
    hotels {
      id
      name
      address
      description
      rooms {
        id
        number
        type
        price
      }
    }
  }
`;

export const GET_HOTEL = gql`
  query GetHotel($id: ID!) {
    hotel(id: $id) {
      id
      name
      address
      description
      rooms {
        id
        number
        type
        price
      }
    }
  }
`;

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      number
      type
      price
      hotelId
      hotel {
        id
        name
        address
      }
    }
  }
`;

export const GET_ROOMS_BY_HOTEL = gql`
  query GetRoomsByHotel($hotelId: ID!) {
    roomsByHotel(hotelId: $hotelId) {
      id
      number
      type
      price
      hotelId
    }
  }
`;

export const CHECK_AVAILABILITY = gql`
  query CheckAvailability($roomId: ID!, $checkIn: String!, $checkOut: String!) {
    checkAvailability(roomId: $roomId, checkIn: $checkIn, checkOut: $checkOut) {
      available
      conflictingBookings {
        id
        guestName
        guestEmail
        checkIn
        checkOut
        isActive
      }
    }
  }
`;

export const GET_BOOKINGS_BY_ROOM = gql`
  query GetBookingsByRoom($roomId: ID!) {
    bookingsByRoom(roomId: $roomId) {
      id
      guestName
      guestEmail
      checkIn
      checkOut
      isActive
      roomId
    }
  }
`;