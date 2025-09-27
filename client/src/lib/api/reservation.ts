import type { CreateReservationData, UpdateReservationData, SpecialRequestData } from './types';
import { api } from './instance';

export type { CreateReservationData, UpdateReservationData, SpecialRequestData };

export async function getReservations(params?: {
  page?: number;
  limit?: number;
  status?: string;
  hotelId?: string;
}) {
  const res = await api.get("/api/reservations", { params });
  return res.data;
}

export async function getReservationById(reservationId: string) {
  const res = await api.get(`/api/reservations/${reservationId}`);
  return res.data;
}

export async function createReservation(
  reservationData: CreateReservationData
) {
  const res = await api.post("/api/reservations", reservationData);
  return res.data;
}

export async function updateReservation(
  reservationId: string,
  reservationData: UpdateReservationData
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}`,
    reservationData
  );
  return res.data;
}

export async function updateReservationStatus(
  reservationId: string,
  status: string
) {
  const res = await api.patch(`/api/reservations/${reservationId}/status`, {
    status,
  });
  return res.data;
}

export async function checkInReservation(
  reservationId: string,
  data?: {
    roomNumber?: string;
    keyCardIssued?: boolean;
  }
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}/check-in`,
    data
  );
  return res.data;
}

export async function checkOutReservation(
  reservationId: string,
  data?: {
    keyCardReturned?: boolean;
    finalBill?: number;
  }
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}/check-out`,
    data
  );
  return res.data;
}

export async function addSpecialRequest(
  reservationId: string,
  requestData: SpecialRequestData
) {
  const res = await api.post(
    `/api/reservations/${reservationId}/special-request`,
    requestData
  );
  return res.data;
}

export async function approveSpecialRequest(
  reservationId: string,
  requestId: string
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}/special-request/${requestId}/approve`
  );
  return res.data;
}
