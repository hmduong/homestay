import {
  postAsyncWithToken,
  getAsyncWithToken,
  getAsync,
} from "utils/request";
export async function yourChats() {
  const url = process.env.REACT_APP_API_URL + "/chats/your-chats";
  return getAsyncWithToken(url);
}
