// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
