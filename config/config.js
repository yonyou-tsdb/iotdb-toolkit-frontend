// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './User/Login',
        },
        {
          name: 'success',
          icon: 'smile',
          path: '/user/success',
          component: './user/success',
        },
        {
          name: 'fail',
          icon: 'smile',
          path: '/user/fail',
          component: './user/fail',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          name: 'reset-password',
          icon: 'smile',
          path: '/user/reset-password',
          component: './user/reset-password',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/',
      redirect: '/list/connection-list',
    },
    {
      path: '/',
      name: 'datasource-manage',
      icon: 'dashboard',
      routes: [
        {
          name: 'connection-list',
          icon: 'smile',
          path: '/list/connection-list',
          component: './list/connection-list',
        },
        {
          name: 'manage-user',
          icon: 'smile',
          path: '/list/manage-user',
          component: './list/manage-user',
        },
        {
          name: 'create-storage-group',
          icon: 'smile',
          path: '/list/manage-storage',
          component: './list/manage-storage',
        },
        {
          name: 'query',
          icon: 'smile',
          path: '/list/query',
          component: './list/query',
        },
        {
          name: 'create-entity',
          icon: 'smile',
          path: '/form/advanced-form2',
          component: './form/advanced-form',
          hideInMenu: true,
        },
        {
          name: 'check-device',
          icon: 'smile',
          path: '/list/table-list',
          component: './list/table-list',
          hideInMenu: true,
        },
        {
          name: 'query',
          icon: 'smile',
          path: '/profile/advanced',
          component: './profile/advanced',
          hideInMenu: true,
        },
        {
          name: 'overview',
          icon: 'smile',
          path: '/list/basic-list',
          component: './list/basic-list',
          hideInMenu: true,
        },
        {
          name: 'settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
          hideInMenu: true,
        },
        {
          name: 'autoSkip',
          icon: 'smile',
          path: '/result/autoSkip',
          component: './result/autoSkip',
          hideInMenu: true,
        },
      ],
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      hideInMenu: true,
      routes: [
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      hideInMenu: true,
      routes: [
        {
          name: 'analysis',
          icon: 'smile',
          path: '/dashboard/analysis',
          component: './dashboard/analysis',
        },
        {
          name: 'monitor',
          icon: 'smile',
          path: '/dashboard/monitor',
          component: './dashboard/monitor',
        },
        {
          name: 'workplace',
          icon: 'smile',
          path: '/dashboard/workplace',
          component: './dashboard/workplace',
        },
      ],
    },
    {
      path: '/form',
      icon: 'form',
      name: 'form',
      hideInMenu: true,
      routes: [
        {
          name: 'step-form',
          icon: 'smile',
          path: '/form/step-form',
          component: './form/step-form',
          hideInMenu: true,
        },
      ],
    },
    {
      path: '/list',
      icon: 'table',
      name: 'list',
      hideInMenu: true,
      routes: [
        {
          path: '/list/search',
          name: 'search-list',
          component: './list/search',
          hideInMenu: true,
          routes: [
            {
              path: '/list/search',
              redirect: '/list/search/articles',
            },
            {
              name: 'articles',
              icon: 'smile',
              path: '/list/search/articles',
              component: './list/search/articles',
            },
            {
              name: 'projects',
              icon: 'smile',
              path: '/list/search/projects',
              component: './list/search/projects',
            },
            {
              name: 'applications',
              icon: 'smile',
              path: '/list/search/applications',
              component: './list/search/applications',
            },
          ],
        },
        {
          name: 'card-list',
          icon: 'smile',
          path: '/list/card-list',
          component: './list/card-list',
          hideInMenu: true,
        },
      ],
    },
    {
      path: '/profile',
      name: 'profile',
      icon: 'profile',
      hideInMenu: true,
      routes: [
        {
          name: 'basic',
          icon: 'smile',
          path: '/profile/basic',
          component: './profile/basic',
          hideInMenu: true,
        },
      ],
    },
    {
      name: 'result',
      icon: 'CheckCircleOutlined',
      path: '/result',
      hideInMenu: true,
      routes: [
        {
          name: 'success',
          icon: 'smile',
          path: '/result/success',
          component: './result/success',
        },
        {
          name: 'fail',
          icon: 'smile',
          path: '/result/fail',
          component: './result/fail',
        },
      ],
    },
    {
      name: 'exception',
      icon: 'warning',
      path: '/exception',
      hideInMenu: true,
      routes: [
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      name: 'editor',
      icon: 'highlight',
      path: '/editor',
      hideInMenu: true,
      routes: [
        {
          name: 'flow',
          icon: 'smile',
          path: '/editor/flow',
          component: './editor/flow',
        },
        {
          name: 'mind',
          icon: 'smile',
          path: '/editor/mind',
          component: './editor/mind',
        },
        {
          name: 'koni',
          icon: 'smile',
          path: '/editor/koni',
          component: './editor/koni',
        },
      ],
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  proxy: {
    '/api': { // 标识需要进行转换的请求的url
       "target": "http://localhost:8080/api/", // 服务端域名
       "changeOrigin": true, // 允许域名进行转换
       "pathRewrite": { "^/api": ''}  // 将请求url里的ci去掉
    },
    '/rpi': { // 标识需要进行转换的请求的url
       "target": "http://localhost:8081/rpi/", // 服务端域名
       "changeOrigin": true, // 允许域名进行转换
       "pathRewrite": { "^/rpi": ''}  // 将请求url里的ci去掉
    }
  },
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      projectName: 'ant-design-pro',
      mock: false,
    },
    // {
    //   requestLibPath: "import { request } from 'umi'",
    //   schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
    //   projectName: 'swagger',
    // },
    {
      requestLibPath: "import { request } from 'umi'",
      // schemaPath: join(__dirname, 'swagger.json'),
      schemaPath: 'http://localhost:8080/v2/api-docs',
      projectName: 'swagger1',
      mock: false,
    },
    // {
    //   requestLibPath: "import { request } from 'umi'",
    //   // schemaPath: join(__dirname, 'swagger.json'),
    //   schemaPath: 'http://localhost:8081/api/spec',
    //   projectName: 'swagger2',
    //   mock: false,
    // },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
});
