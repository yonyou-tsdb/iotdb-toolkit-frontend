// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** /api/connection/addThenReturnLess /api/connection/addThenReturnLess GET /api/connection/addThenReturnLess */
export async function connectionAddThenReturnLessUsingGET(
  params: {
    // query
    /** connectionUsername */
    connectionUsername: string;
    /** connectionPassword */
    connectionPassword: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    /** connectionName */
    connectionName: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/addThenReturnLess', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/addThenReturnLess /api/connection/addThenReturnLess POST /api/connection/addThenReturnLess */
export async function connectionAddThenReturnLessUsingPOST(
  params: {
    // query
    /** connectionUsername */
    connectionUsername: string;
    /** connectionPassword */
    connectionPassword: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    /** connectionName */
    connectionName: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/addThenReturnLess', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/all /api/connection/all GET /api/connection/all */
export async function connectionAllUsingGET(
  params: {
    // query
    /** pageSize */
    pageSize: number;
    /** pageNum */
    pageNum: number;
    /** aliasLike */
    aliasLike?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/all', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/all /api/connection/all POST /api/connection/all */
export async function connectionAllUsingPOST(
  params: {
    // query
    /** pageSize */
    pageSize: number;
    /** pageNum */
    pageNum: number;
    /** aliasLike */
    aliasLike?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/all', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/default /api/connection/default GET /api/connection/default */
export async function connectionDefaultUsingGET(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/default', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/default /api/connection/default POST /api/connection/default */
export async function connectionDefaultUsingPOST(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/default', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/delete /api/connection/delete GET /api/connection/delete */
export async function connectionDeleteUsingGET(
  params: {
    // query
    /** id */
    id: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/delete', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/delete /api/connection/delete POST /api/connection/delete */
export async function connectionDeleteUsingPOST(
  params: {
    // query
    /** id */
    id: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/delete', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/less /api/connection/less GET /api/connection/less */
export async function connectionLessUsingGET(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/less', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** /api/connection/less /api/connection/less POST /api/connection/less */
export async function connectionLessUsingPOST(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/less', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** /api/connection/test /api/connection/test GET /api/connection/test */
export async function connectionTestUsingGET(
  params: {
    // query
    /** connectionUsername */
    connectionUsername: string;
    /** connectionPassword */
    connectionPassword: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/test', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/test /api/connection/test POST /api/connection/test */
export async function connectionTestUsingPOST(
  params: {
    // query
    /** connectionUsername */
    connectionUsername: string;
    /** connectionPassword */
    connectionPassword: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/test', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/testById /api/connection/testById GET /api/connection/testById */
export async function connectionTestByIdUsingGET(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    /** connectionUsername */
    connectionUsername: string;
    /** connectionPassword */
    connectionPassword?: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/testById', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/testById /api/connection/testById POST /api/connection/testById */
export async function connectionTestByIdUsingPOST(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    /** connectionUsername */
    connectionUsername: string;
    /** connectionPassword */
    connectionPassword?: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/testById', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/undefault /api/connection/undefault GET /api/connection/undefault */
export async function connectionUndefaultUsingGET(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/undefault', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/undefault /api/connection/undefault POST /api/connection/undefault */
export async function connectionUndefaultUsingPOST(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/undefault', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/update /api/connection/update GET /api/connection/update */
export async function connectionUpdateUsingGET(
  params: {
    // query
    /** connectionUsername */
    connectionUsername: string;
    /** connectionId */
    connectionId: number;
    /** connectionPassword */
    connectionPassword: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    /** connectionName */
    connectionName: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/update', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/update /api/connection/update POST /api/connection/update */
export async function connectionUpdateUsingPOST(
  params: {
    // query
    /** connectionUsername */
    connectionUsername: string;
    /** connectionId */
    connectionId: number;
    /** connectionPassword */
    connectionPassword: string;
    /** ip */
    ip: string;
    /** port */
    port: number;
    /** connectionName */
    connectionName: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/update', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/view /api/connection/view GET /api/connection/view */
export async function connectionViewUsingGET(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/view', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** /api/connection/view /api/connection/view POST /api/connection/view */
export async function connectionViewUsingPOST(
  params: {
    // query
    /** connectionId */
    connectionId: number;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<API.BaseVOObject_>('/api/connection/view', {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
