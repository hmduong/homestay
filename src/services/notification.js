import { getAsyncWithToken } from "utils/request";
export async function getNoti() {
  const url = process.env.REACT_APP_API_URL + "/notifications";
  return getAsyncWithToken(url);
}

export async function checkNoti() {
  const url = process.env.REACT_APP_API_URL + "/notifications/check";
  return getAsyncWithToken(url);
}
