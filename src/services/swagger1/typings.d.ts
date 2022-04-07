// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Connect = {
    alias?: string;
    createTime?: string;
    host?: string;
    id?: number;
    password?: string;
    port?: number;
    query?: QueryFace[];
    queryMap?: Record<string, any>;
    url?: string;
    user?: User;
    userId?: number;
    username?: string;
  };

  type ConnectFace = {
    id?: Record<string, any>;
  };

  type EmailLogFace = {
    id?: Record<string, any>;
  };

  type JSONObject = true;

  type QueryFace = {
    id?: Record<string, any>;
  };

  type User = {
    connect?: ConnectFace[];
    connectMap?: Record<string, any>;
    emailLog?: EmailLogFace[];
    emailLogMap?: Record<string, any>;
    id?: number;
    name?: string;
    password?: string;
    setting?: Record<string, any>;
  };

  type BaseVOConnect_ = {
    code?: string;
    data?: Connect;
    message?: string;
  };

  type BaseVOJSONObject_ = {
    code?: string;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseVOUser_ = {
    code?: string;
    data?: User;
    message?: string;
  };

  type BaseVOObject_ = {
    code?: string;
    data?: Record<string, any>;
    message?: string;
  };
}
