import { apolloClient } from '../apollo/client';
import { CHECK_AVAILABILITY } from '../graphql/queries';
import { CREATE_BOOKING, CANCEL_BOOKING } from '../graphql/mutations';
import { GET_ROOMS } from '../graphql/queries';
import type { AvailabilityResult, CreateBookingInput, Booking } from '../types';

export class BookingService {
  async checkAvailability(
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<AvailabilityResult> {
    const { data } = await apolloClient.query({
      query: CHECK_AVAILABILITY,
      variables: { roomId, checkIn, checkOut },
      fetchPolicy: 'network-only',
    });
    return data.checkAvailability;
  }

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_BOOKING,
      variables: { input },
      refetchQueries: [{ query: GET_ROOMS }],
    });
    return data.createBooking;
  }

  async cancelBooking(id: string): Promise<Booking> {
    const { data } = await apolloClient.mutate({
      mutation: CANCEL_BOOKING,
      variables: { id },
      refetchQueries: [{ query: GET_ROOMS }],
    });
    return data.cancelBooking;
  }
}
