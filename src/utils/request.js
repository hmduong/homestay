import axios from "axios";

export function getCookie(name = "currentuser") {
  const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

export async function getAsync(url, params = {}, language = "vi") {
  try {
    const response = await axios.get(url, params, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (ex) {
    const { status = 400, data = {} } = ex.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: {},
      message: error[0]?.message || "",
      code: error[0]?.code || 0,
    };
  }
}

export async function postAsync(url, params = {}) {
  try {
    const response = await axios.post(url, params);
    return response;
  } catch (ex) {
    const { status = 400, data = {}, errors = [] } = ex.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: ex?.response?.data || {},
      errors,
      message: error[0]?.message || "",
    };
  }
}
export async function postAsyncWithHeader(url, params = {}, header = {}) {
  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: header,
        params: params,
      }
    );
    return response;
  } catch (ex) {
    const { status = 400, data = {}, errors = [] } = ex.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: ex?.response?.data || {},
      errors,
      message: error[0]?.message || "",
    };
  }
}

export async function getAsyncWithToken(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + getCookie(),
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
    return response;
  } catch (ex) {
    const { status = 400, data = {} } = ex?.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: {},
      message: error[0]?.message || "",
      code: error[0]?.code || 0,
    };
  }
}

export async function postAsyncWithToken(url, data = {}) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: "Bearer " + getCookie(),
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    return response;
  } catch (ex) {
    const { status = 400, data = {} } = ex?.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: {},
      message: error[0]?.message || "",
      code: error[0]?.code || 0,
    };
  }
}

export const multipleFilesUpload = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: "Bearer " + getCookie(),
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "Cache-Control": "no-cache",
      },
    });
    return response;
  } catch (ex) {
    const { status = 400, data = {} } = ex?.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: {},
      message: error[0]?.message || "",
      code: error[0]?.code || 0,
    };
  }
};

export async function deleteAsyncWithToken(url) {
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: "Bearer " + getCookie(),
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    return response;
  } catch (ex) {
    const { status = 400, data = {} } = ex?.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: {},
      message: error[0]?.message || "",
      code: error[0]?.code || 0,
    };
  }
}

export async function putAsyncWithToken(url, data) {
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: "Bearer " + getCookie(),
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    return response;
  } catch (ex) {
    const { status = 400, data = {} } = ex?.response || {};
    const error = data?.errors || [];
    return {
      status,
      data: {},
      message: error[0]?.message || "",
      code: error[0]?.code || 0,
    };
  }
}
