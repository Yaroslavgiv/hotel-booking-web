import { apolloClient } from '../apollo/client';
import { GET_HOTELS, GET_HOTEL, GET_ROOMS, GET_ROOMS_BY_HOTEL } from '../graphql/queries';
import type { Hotel, Room } from '../types';

export class HotelService {
  async getAllHotels(): Promise<Hotel[]> {
    const { data } = await apolloClient.query({
      query: GET_HOTELS,
      fetchPolicy: 'cache-first',
    });
    return data.hotels;
  }

  async getHotelById(id: string): Promise<Hotel | null> {
    const { data } = await apolloClient.query({
      query: GET_HOTEL,
      variables: { id },
      fetchPolicy: 'cache-first',
    });
    return data.hotel;
  }

  async getAllRooms(): Promise<Room[]> {
    const { data } = await apolloClient.query({
      query: GET_ROOMS,
      fetchPolicy: 'cache-first',
    });
    return data.rooms;
  }

  async getRoomsByHotelId(hotelId: string): Promise<Room[]> {
    const { data } = await apolloClient.query({
      query: GET_ROOMS_BY_HOTEL,
      variables: { hotelId },
      fetchPolicy: 'cache-first',
    });
    return data.roomsByHotel;
  }
}
