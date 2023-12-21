import {
  postAsyncWithHeader,
  getCookie,
  postAsyncWithToken,
  getAsyncWithToken,
  putAsyncWithToken,
  getAsync,
} from "utils/request";
import axios from "axios";
export async function createHomestay(data, image) {
  const url = process.env.REACT_APP_API_URL + "/homestays";
  return postAsyncWithToken(url, data);
}

export async function deleteHomestay(id) {
  const url = process.env.REACT_APP_API_URL + `/homestays/${id}/delete`;
  return postAsyncWithToken(url);
}

export async function editHomestay(id, data) {
  const url = process.env.REACT_APP_API_URL + "/homestays/" + id;
  return putAsyncWithToken(url, data);
}

export async function getListHomestay(userid) {
  const url = process.env.REACT_APP_API_URL + `/homestays?userid=${userid}`;
  return getAsyncWithToken(url);
}

export async function getHomestay(id) {
  const url = process.env.REACT_APP_API_URL + `/homestays/${id}`;
  return getAsync(url);
}

export async function getTop(payload) {
  const url = process.env.REACT_APP_API_URL + `/homestays/top?limit=${payload.limit}`;
  return getAsync(url);
}
