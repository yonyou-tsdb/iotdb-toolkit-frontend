// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** queryAll GET /api/query/all */
export async function queryAllUsingGET(
  params: {
    // query
    /** pageSize */
    pageSize: number;
    /** pageNum */
    pageNum: number;
    /** nameLike */
    nameLike?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/all', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** queryAll POST /api/query/all */
export async function queryAllUsingPOST(
  params: {
    // query
    /** pageSize */
    pageSize: number;
    /** pageNum */
    pageNum: number;
    /** nameLike */
    nameLike?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/all', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteThenReturnAll GET /api/query/deleteThenReturnAll */
export async function deleteThenReturnAllUsingGET(
  params: {
    // query
    /** queryId */
    queryId: number;
    /** pageSize */
    pageSize: number;
    /** pageNum */
    pageNum: number;
    /** nameLike */
    nameLike?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/deleteThenReturnAll', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteThenReturnAll POST /api/query/deleteThenReturnAll */
export async function deleteThenReturnAllUsingPOST(
  params: {
    // query
    /** queryId */
    queryId: number;
    /** pageSize */
    pageSize: number;
    /** pageNum */
    pageNum: number;
    /** nameLike */
    nameLike?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/deleteThenReturnAll', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** queryExportCsvWithTenant GET /api/query/exportCsv */
export async function queryExportCsvWithTenantUsingGET(
  params: {
    // query
    /** sqls */
    sqls: string;
    /** timeformat */
    timeformat: string;
    /** timeZone */
    timeZone: string;
    /** targetFile */
    targetFile: string;
    /** compress */
    compress?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/exportCsv', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** queryExportCsvWithTenant POST /api/query/exportCsv */
export async function queryExportCsvWithTenantUsingPOST(
  params: {
    // query
    /** sqls */
    sqls: string;
    /** timeformat */
    timeformat: string;
    /** timeZone */
    timeZone: string;
    /** targetFile */
    targetFile: string;
    /** compress */
    compress?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/exportCsv', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** queryImportCsvWithTenant POST /api/query/importCsv */
export async function queryImportCsvWithTenantUsingPOST(
  params: {
    // query
    /** timeZone */
    timeZone: string;
    /** compress */
    compress?: string;
    // path
  },
  body: {
    /** Filedata */
    Filedata?: string;
  },
  files?: File[],
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  const formData = new FormData();
  if (files) {
    formData.append('Filedata', files[0] || '');
  }
  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(ele, typeof item === 'object' ? JSON.stringify(item) : item);
    }
  });

  return request<API.BaseVOObject_>('/api/query/importCsv', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: {
      ...queryParams,
    },
    data: formData,
    ...(options || {}),
  });
}

/** querySqlWithTenant GET /api/query/querySql */
export async function querySqlWithTenantUsingGET(
  params: {
    // query
    /** sqls */
    sqls: string;
    /** queryToken */
    queryToken: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/querySql', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** querySqlWithTenant POST /api/query/querySql */
export async function querySqlWithTenantUsingPOST(
  params: {
    // query
    /** sqls */
    sqls: string;
    /** queryToken */
    queryToken: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/querySql', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** querySqlAppendWithTenant GET /api/query/querySqlAppend */
export async function querySqlAppendWithTenantUsingGET(
  params: {
    // query
    /** queryToken */
    queryToken: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/querySqlAppend', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** querySqlAppendWithTenant POST /api/query/querySqlAppend */
export async function querySqlAppendWithTenantUsingPOST(
  params: {
    // query
    /** queryToken */
    queryToken: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/querySqlAppend', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** querySave GET /api/query/save */
export async function querySaveUsingGET(
  params: {
    // query
    /** sqls */
    sqls: string;
    /** name */
    name: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/save', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** querySave POST /api/query/save */
export async function querySaveUsingPOST(
  params: {
    // query
    /** sqls */
    sqls: string;
    /** name */
    name: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/save', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** updatePointWithTenant GET /api/query/updatePoint */
export async function updatePointWithTenantUsingGET(
  params: {
    // query
    /** timestamp */
    timestamp: number;
    /** point */
    point: string;
    /** value */
    value: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/updatePoint', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** updatePointWithTenant POST /api/query/updatePoint */
export async function updatePointWithTenantUsingPOST(
  params: {
    // query
    /** timestamp */
    timestamp: number;
    /** point */
    point: string;
    /** value */
    value: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/query/updatePoint', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
