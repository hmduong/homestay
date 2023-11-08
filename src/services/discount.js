import {
  postAsyncWithToken,
  getAsyncWithToken,
  getAsync,
} from "utils/request";
export async function createDiscount(data) {
  const url = process.env.REACT_APP_API_URL + "/discounts";
  return postAsyncWithToken(url, data);
}

export async function deactivateDiscount(id) {
  const url = process.env.REACT_APP_API_URL + "/discounts/" + id;
  return postAsyncWithToken(url, {});
}

export async function getListDiscount() {
  const url = process.env.REACT_APP_API_URL + "/discounts";
  return getAsyncWithToken(url);
}

export async function getDiscountsByHomestay(id, params = {}) {
  console.log({ params });
  const url = process.env.REACT_APP_API_URL + "/discounts/homestays/" + id;
  return getAsync(url, params);
}
