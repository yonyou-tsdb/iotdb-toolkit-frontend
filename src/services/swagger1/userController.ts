// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** acquireCaptcha GET /api/acquireCaptcha */
export async function acquireCaptchaUsingGET(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/api/acquireCaptcha', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** activateAccount GET /api/activateAccount/${param0}/${param1} */
export async function activateAccountUsingGET(
  params: {
    // path
    /** elId */
    elId: number;
    /** token */
    token: string;
  },
  options?: { [key: string]: any },
) {
  const { elId: param0, token: param1, ...queryParams } = params;
  return request<any>(`/api/activateAccount/${param0}/${param1}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** /api/currentUser /api/currentUser GET /api/currentUser */
export async function currentUserUsingGET(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/currentUser', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** /api/currentUser /api/currentUser POST /api/currentUser */
export async function currentUserUsingPOST(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/currentUser', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** deleteAccount POST /api/deleteAccount */
export async function deleteAccountUsingPOST(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/deleteAccount', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** /api/login/account /api/login/account GET /api/login/account */
export async function loginAccountUsingGET(
  params: {
    // query
    /** username */
    username: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/login/account', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/login/account /api/login/account POST /api/login/account */
export async function loginAccountUsingPOST(
  params: {
    // query
    /** username */
    username: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/login/account', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/outLogin /api/outLogin GET /api/outLogin */
export async function outLoginUsingGET(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/outLogin', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** /api/outLogin /api/outLogin POST /api/outLogin */
export async function outLoginUsingPOST(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/outLogin', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** register GET /api/register */
export async function registerUsingGET(
  params: {
    // query
    /** mail */
    mail: string;
    /** username */
    username: string;
    /** password */
    password: string;
    /** captcha */
    captcha: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/register', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** register POST /api/register */
export async function registerUsingPOST(
  params: {
    // query
    /** mail */
    mail: string;
    /** username */
    username: string;
    /** password */
    password: string;
    /** captcha */
    captcha: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/register', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** resetPassword GET /api/resetPassword/${param0}/${param1} */
export async function resetPasswordUsingGET(
  params: {
    // path
    /** elId */
    elId: number;
    /** token */
    token: string;
  },
  options?: { [key: string]: any },
) {
  const { elId: param0, token: param1, ...queryParams } = params;
  return request<any>(`/api/resetPassword/${param0}/${param1}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** resetUpdatePassword GET /api/resetUpdatePassword */
export async function resetUpdatePasswordUsingGET(
  params: {
    // query
    /** id */
    id: number;
    /** token */
    token: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/resetUpdatePassword', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** resetUpdatePassword POST /api/resetUpdatePassword */
export async function resetUpdatePasswordUsingPOST(
  params: {
    // query
    /** id */
    id: number;
    /** token */
    token: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/resetUpdatePassword', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** sendResetPasswordMail GET /api/sendResetPasswordMail */
export async function sendResetPasswordMailUsingGET(
  params: {
    // query
    /** email */
    email: string;
    /** captcha */
    captcha: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/sendResetPasswordMail', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** sendResetPasswordMail POST /api/sendResetPasswordMail */
export async function sendResetPasswordMailUsingPOST(
  params: {
    // query
    /** email */
    email: string;
    /** captcha */
    captcha: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/sendResetPasswordMail', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** updatePassword GET /api/updatePassword */
export async function updatePasswordUsingGET(
  params: {
    // query
    /** passwordOrigin */
    passwordOrigin: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/updatePassword', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** updatePassword POST /api/updatePassword */
export async function updatePasswordUsingPOST(
  params: {
    // query
    /** passwordOrigin */
    passwordOrigin: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/updatePassword', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** connect connect GET /connect */
export async function connectUsingGET(
  params: {
    // query
    /** id */
    id: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOConnect_>('/connect', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** toLogin GET /toLogin */
export async function toLoginUsingGET(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/toLogin', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** toLogin POST /toLogin */
export async function toLoginUsingPOST(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/toLogin', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** user user GET /user */
export async function userUsingGET(
  params: {
    // query
    /** id */
    id: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOUser_>('/user', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
