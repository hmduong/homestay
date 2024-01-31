import {
  deleteAsyncWithToken,
  getAsyncWithToken,
  postAsync,
  postAsyncWithToken,
  putAsyncWithToken,
} from "utils/request";
export async function search(data, pagi = {}) {
  const url = `${process.env.REACT_APP_API_URL}/search?limit=${pagi.limit || 9}&page=${pagi.page || 1}`;
  return postAsync(url, data);
}

export async function book(homestayId, data) {
  const url = process.env.REACT_APP_API_URL + "/bookings/" + homestayId;
  return postAsyncWithToken(url, data);
}

export async function editBook(id, data) {
  const url = process.env.REACT_APP_API_URL + "/bookings/" + id;
  return putAsyncWithToken(url, data);
}

export async function getBookingListByHomestay(url) {
  return getAsyncWithToken(url);
}

export async function getBooking(id) {
  const url = process.env.REACT_APP_API_URL + "/bookings/" + id;
  return getAsyncWithToken(url);
}

export async function getYourBooking(limit, page, id) {
  const url = process.env.REACT_APP_API_URL + `/bookings/your-booking/${id}?limit=${limit}&page=${page}`;
  return getAsyncWithToken(url);
}

export async function deleteServiceBooking(id) {
  const url = process.env.REACT_APP_API_URL + "/service-bookings/" + id;
  return deleteAsyncWithToken(url);
}
