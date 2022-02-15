// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.CurrentUser>('/api/currentUser', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/outLogin */
export async function outLogin(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(
  params: {
    // path
  },
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
