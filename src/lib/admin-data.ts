import { getService, getTeamMember } from "@/lib/data";
import type { Booking } from "@/lib/supabase/types";

export function enrichBooking(booking: Booking) {
  return {
    ...booking,
    serviceTitle: getService(booking.service_slug)?.title ?? booking.service_slug,
    lawyerName: booking.lawyer_slug
      ? (getTeamMember(booking.lawyer_slug)?.name ?? booking.lawyer_slug)
      : null,
  };
}

export function enrichBookings(bookings: Booking[]) {
  return bookings.map(enrichBooking);
}
