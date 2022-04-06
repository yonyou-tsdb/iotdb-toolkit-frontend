// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** sendRegisterEmail GET /api/acquireCaptcha */
export async function sendRegisterEmailUsingGET(
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
  return request<Record<string, any>>('/api/outLogin', {
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
  return request<Record<string, any>>('/api/outLogin', {
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

/** sendRegisterEmail GET /api/sendRegisterEmail */
export async function sendRegisterEmailUsingGET1(
  params: {
    // query
    /** username */
    username?: string;
    /** password */
    password?: string;
    /** email */
    email: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/sendRegisterEmail', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** sendRegisterEmail POST /api/sendRegisterEmail */
export async function sendRegisterEmailUsingPOST(
  params: {
    // query
    /** username */
    username?: string;
    /** password */
    password?: string;
    /** email */
    email: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOJSONObject_>('/api/sendRegisterEmail', {
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
