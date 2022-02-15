// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** My awesome handler It creates a pretty JSON object GET /rpi/test_select_by_condition2 */
export async function app_testSelectByCondition2(
  params: {
    // query
    id?: number;
    name?: string;
    password?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/rpi/test_select_by_condition2', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** My awesome handler It creates a pretty JSON object GET /test_fetch_by_wrapper2 */
export async function testFetchByWrapper2(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.User>('/test_fetch_by_wrapper2', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** My awesome handler It creates a pretty JSON object GET /test_select_by_condition5 */
export async function testSelectByCondition5(
  params: {
    // query
    alias?: string;
    host?: string;
    id?: number;
    password?: string;
    port?: number;
    user_id?: number;
    username?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/test_select_by_condition5', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** My awesome handler It creates a pretty JSON object GET /test_select_by_condition6 */
export async function testSelectByCondition6(
  params: {
    // query
    alias?: string;
    host?: string;
    id?: number;
    password?: string;
    port?: number;
    user_id?: number;
    username?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/test_select_by_condition6', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
