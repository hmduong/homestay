import { getAsyncWithToken } from "utils/request";
export async function getStatisticsByHomestay(url) {
  return getAsyncWithToken(url);
}
