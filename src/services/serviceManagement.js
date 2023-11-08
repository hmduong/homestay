import {
  getAsync,
  postAsyncWithToken,
  putAsyncWithToken,
} from "utils/request";
export async function createService(data) {
  const url = process.env.REACT_APP_API_URL + "/services";
  return postAsyncWithToken(url, data);
}

export async function editService(id, data) {
  const url = process.env.REACT_APP_API_URL + "/services/" + id;
  return putAsyncWithToken(url, data);
}

export async function getServicesByHomestay(homestayId) {
  const url =
    process.env.REACT_APP_API_URL + "/services/" + homestayId + "/all";
  return getAsync(url);
}

export async function getServiceById(id) {
  const url = process.env.REACT_APP_API_URL + "/services/" + id;
  return getAsync(url);
}
