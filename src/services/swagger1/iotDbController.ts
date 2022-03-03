// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** /api/iotdb/addPrivileges /api/iotdb/addPrivileges GET /api/iotdb/addPrivileges */
export async function addPrivilegesWithTenantUsingGET(
  params: {
    // query
    /** user */
    user: string;
    /** auth */
    auth: string;
    /** timeseries */
    timeseries?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/addPrivileges', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/addPrivileges /api/iotdb/addPrivileges POST /api/iotdb/addPrivileges */
export async function addPrivilegesWithTenantUsingPOST(
  params: {
    // query
    /** user */
    user: string;
    /** auth */
    auth: string;
    /** timeseries */
    timeseries?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/addPrivileges', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** addStorageGroupWithTenant GET /api/iotdb/addStorageGroup */
export async function addStorageGroupWithTenantUsingGET(
  params: {
    // query
    /** name */
    name: string;
    /** ttl */
    ttl?: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/addStorageGroup', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** addStorageGroupWithTenant POST /api/iotdb/addStorageGroup */
export async function addStorageGroupWithTenantUsingPOST(
  params: {
    // query
    /** name */
    name: string;
    /** ttl */
    ttl?: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/addStorageGroup', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** addTimeseriesWithTenant GET /api/iotdb/addTimeseries */
export async function addTimeseriesWithTenantUsingGET(
  params: {
    // query
    /** path */
    path: string;
    /** dataType */
    dataType: string;
    /** encoding */
    encoding: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/addTimeseries', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** addTimeseriesWithTenant POST /api/iotdb/addTimeseries */
export async function addTimeseriesWithTenantUsingPOST(
  params: {
    // query
    /** path */
    path: string;
    /** dataType */
    dataType: string;
    /** encoding */
    encoding: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/addTimeseries', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/addUser/{user} /api/iotdb/addUser/{user} GET /api/iotdb/addUser/${param0} */
export async function addUserWithTenantUsingGET(
  params: {
    // query
    password?: string;
    user?: string;
    // path
    user: string;
  },
  options?: { [key: string]: any },
) {
  const { user: param0, ...queryParams } = params;
  return request<API.BaseVOObject_>(`/api/iotdb/addUser/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/addUser/{user} /api/iotdb/addUser/{user} POST /api/iotdb/addUser/${param0} */
export async function addUserWithTenantUsingPOST(
  params: {
    // query
    password?: string;
    user?: string;
    // path
    user: string;
  },
  options?: { [key: string]: any },
) {
  const { user: param0, ...queryParams } = params;
  return request<API.BaseVOObject_>(`/api/iotdb/addUser/${param0}`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/changePrivileges /api/iotdb/changePrivileges GET /api/iotdb/changePrivileges */
export async function changePrivilegesWithTenantUsingGET(
  params: {
    // query
    /** user */
    user: string;
    /** auth */
    auth?: string;
    /** range */
    range: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/changePrivileges', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/changePrivileges /api/iotdb/changePrivileges POST /api/iotdb/changePrivileges */
export async function changePrivilegesWithTenantUsingPOST(
  params: {
    // query
    /** user */
    user: string;
    /** auth */
    auth?: string;
    /** range */
    range: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/changePrivileges', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteStorageGroupWithTenant GET /api/iotdb/deleteStorageGroup */
export async function deleteStorageGroupWithTenantUsingGET(
  params: {
    // query
    /** name */
    name: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/deleteStorageGroup', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteStorageGroupWithTenant POST /api/iotdb/deleteStorageGroup */
export async function deleteStorageGroupWithTenantUsingPOST(
  params: {
    // query
    /** name */
    name: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/deleteStorageGroup', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteTimeseriesWithTenant GET /api/iotdb/deleteTimeseries */
export async function deleteTimeseriesWithTenantUsingGET(
  params: {
    // query
    /** path */
    path: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/deleteTimeseries', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteTimeseriesWithTenant POST /api/iotdb/deleteTimeseries */
export async function deleteTimeseriesWithTenantUsingPOST(
  params: {
    // query
    /** path */
    path: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/deleteTimeseries', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteUserWithTenant GET /api/iotdb/deleteUser */
export async function deleteUserWithTenantUsingGET(
  params: {
    // query
    /** user */
    user: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/deleteUser', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteUserWithTenant POST /api/iotdb/deleteUser */
export async function deleteUserWithTenantUsingPOST(
  params: {
    // query
    /** user */
    user: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/deleteUser', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** editStorageGroupWithTenant GET /api/iotdb/editStorageGroup */
export async function editStorageGroupWithTenantUsingGET(
  params: {
    // query
    /** name */
    name: string;
    /** ttl */
    ttl?: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/editStorageGroup', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** editStorageGroupWithTenant POST /api/iotdb/editStorageGroup */
export async function editStorageGroupWithTenantUsingPOST(
  params: {
    // query
    /** name */
    name: string;
    /** ttl */
    ttl?: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/editStorageGroup', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/editUser /api/iotdb/editUser GET /api/iotdb/editUser */
export async function editUserWithTenantUsingGET(
  params: {
    // query
    /** user */
    user: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/editUser', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/editUser /api/iotdb/editUser POST /api/iotdb/editUser */
export async function editUserWithTenantUsingPOST(
  params: {
    // query
    /** user */
    user: string;
    /** password */
    password: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/editUser', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/listPrivileges /api/iotdb/listPrivileges GET /api/iotdb/listPrivileges */
export async function listPrivilegesWithTenantUsingGET(
  params: {
    // query
    /** user */
    user: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/listPrivileges', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/listPrivileges /api/iotdb/listPrivileges POST /api/iotdb/listPrivileges */
export async function listPrivilegesWithTenantUsingPOST(
  params: {
    // query
    /** user */
    user: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/listPrivileges', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/listPrivilegesAppend /api/iotdb/listPrivilegesAppend GET /api/iotdb/listPrivilegesAppend */
export async function listPrivilegesAppendWithTenantUsingGET(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/listPrivilegesAppend', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/listPrivilegesAppend /api/iotdb/listPrivilegesAppend POST /api/iotdb/listPrivilegesAppend */
export async function listPrivilegesAppendWithTenantUsingPOST(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/listPrivilegesAppend', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/iotdb/listUser /api/iotdb/listUser GET /api/iotdb/listUser */
export async function listUserWithTenantUsingGET(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/listUser', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** /api/iotdb/listUser /api/iotdb/listUser POST /api/iotdb/listUser */
export async function listUserWithTenantUsingPOST(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/listUser', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** showStorageWithTenant GET /api/iotdb/showStorage */
export async function showStorageWithTenantUsingGET(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showStorage', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** showStorageWithTenant POST /api/iotdb/showStorage */
export async function showStorageWithTenantUsingPOST(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showStorage', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** showStorageAppendWithTenant GET /api/iotdb/showStorageAppend */
export async function showStorageAppendWithTenantUsingGET(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showStorageAppend', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** showStorageAppendWithTenant POST /api/iotdb/showStorageAppend */
export async function showStorageAppendWithTenantUsingPOST(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showStorageAppend', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** showTimeseriesWithTenant GET /api/iotdb/showTimeseries */
export async function showTimeseriesWithTenantUsingGET(
  params: {
    // query
    /** path */
    path: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showTimeseries', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** showTimeseriesWithTenant POST /api/iotdb/showTimeseries */
export async function showTimeseriesWithTenantUsingPOST(
  params: {
    // query
    /** path */
    path: string;
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showTimeseries', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** showTimeseriesAppendWithTenant GET /api/iotdb/showTimeseriesAppend */
export async function showTimeseriesAppendWithTenantUsingGET(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showTimeseriesAppend', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** showTimeseriesAppendWithTenant POST /api/iotdb/showTimeseriesAppend */
export async function showTimeseriesAppendWithTenantUsingPOST(
  params: {
    // query
    /** token */
    token: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/iotdb/showTimeseriesAppend', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
