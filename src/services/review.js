import { postAsyncWithToken, getAsync } from "utils/request";
export async function review(bookingId, data) {
  const url = process.env.REACT_APP_API_URL + "/reviews/" + bookingId;
  return postAsyncWithToken(url, data);
}

export async function getReviewsByHomestayId(id) {
  const url = process.env.REACT_APP_API_URL + `/reviews/${id}`;
  return getAsync(url);
}
