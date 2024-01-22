import { postAsyncWithToken, getAsync } from "utils/request";
export async function review(bookingId, data) {
  const url = process.env.REACT_APP_API_URL + "/reviews/" + bookingId;
  return postAsyncWithToken(url, data);
}

export async function getReviewsByHomestayId(id, limit, page) {
  const url = process.env.REACT_APP_API_URL + `/reviews/homestay/${id}?limit=${limit}&page=${page}`;
  return getAsync(url);
}


export async function getReviewById(id) {
  const url = process.env.REACT_APP_API_URL + `/reviews/booking/${id}`;
  return getAsync(url);
}