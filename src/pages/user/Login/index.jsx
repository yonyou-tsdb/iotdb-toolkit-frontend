import {
  GithubOutlined,
  ReadOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, notification, Checkbox, Form } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { loginAccountUsingPOST } from '@/services/swagger1/userController';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';
import CookieUtil from '../../../utils/CookieUtil';
const Login = () => {
  const { getItem, addItem } = CookieUtil;
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const LoginMessage = ({ content }) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      const connectionLess = await initialState?.fetchConnectionLess?.();
      setInitialState({ ...initialState, currentUser: userInfo, connectionLess: connectionLess });
    }
  };
  const goto = () => {

    if (!history) return;
    setTimeout(() => {
      const { query } = history.location;
      const { redirect } = query;
      history.replace(redirect || '/');
      // window.location = window.location.protocol + '//' + window.location.host + '/list/connection-list';
    }, 10);
  };
  const selectConnection = (item) => {
    const jsessionid = getItem('JSESSIONID');
    addItem(jsessionid+"-alias", item.alias, '/');
    addItem(jsessionid+"-host", item.host, '/');
    addItem(jsessionid+"-port", item.port, '/');
    addItem(jsessionid+"-username", item.username, '/');
    addItem(jsessionid+"-tenantId", item.id, '/');
    setInitialState({ ...initialState, activeConnection: item,
      activeConnectionDesc: item.username+'@'+item.host+':'+item.port});
  };
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 登录
      let msg = await loginAccountUsingPOST({ ...values, type });
      let errorMsg = msg.message;
      msg = msg.data == null ? msg : msg.data;
      if (msg.status === 'ok') {
        if(msg.defaultConnect==null){
          const defaultloginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success-without-tenant',
            defaultMessage: '登录成功，请指定要管理的数据源',
          });
          message.success(defaultloginSuccessMessage);
        }else{
          selectConnection(msg.defaultConnect);
        }
        await fetchUserInfo();
        goto();
        return;
      } // 如果失败去设置用户错误信息
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败',
      });
      notification.error({
        message: defaultloginFailureMessage,
        description: errorMsg,
      });
      // setUserLoginState(msg);
    } catch (error) {
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败',
      });
      message.error(defaultloginFailureMessage);
    }

    setSubmitting(false);
  };

  const { status, type: loginType } = userLoginState;
  const [form] = Form.useForm();
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/iotdb-logo.png" />
              <span className={styles.title}>
                {intl.formatMessage({
                  id: 'pages.layouts.userLayout.mainTitle',
                  defaultMessage: 'Time Series Database',
                })}
              </span>
            </Link>
          </div>
          <div className={styles.desc}>
            {intl.formatMessage({
              id: 'pages.layouts.userLayout.title',
            })}
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
            form={form}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                })}
              />
              <Tabs.TabPane
                key="mobile"
                tab={intl.formatMessage({
                  id: 'pages.login.forgotPassword',
                })}
                disabled={true}
              />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      ),
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                  }}
                  name="mobile"
                  placeholder={intl.formatMessage({
                    id: 'pages.login.phoneNumber.placeholder',
                    defaultMessage: '手机号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.required"
                          defaultMessage="请输入手机号！"
                        />
                      ),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.invalid"
                          defaultMessage="手机号格式错误！"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.captcha.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${intl.formatMessage({
                        id: 'pages.getCaptchaSecondText',
                        defaultMessage: '获取验证码',
                      })}`;
                    }

                    return intl.formatMessage({
                      id: 'pages.login.phoneLogin.getVerificationCode',
                      defaultMessage: '获取验证码',
                    });
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.captcha.required"
                          defaultMessage="请输入验证码！"
                        />
                      ),
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    const result = await getFakeCaptcha({
                      phone:form.getFieldValue('mobile'),
                    });

                    if (result === false) {
                      return;
                    }

                    message.success('获取验证码成功！验证码为：1234');
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <Checkbox danger defaultChecked={true} noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </Checkbox>
              <Link to='/user/register' style={{
                float: 'right',
              }}>
                <FormattedMessage id='pages.login.registerAccount' defaultMessage="注册账号" />
              </Link>
            </div>
          </ProForm>
          <Space className={styles.other}>
            <FormattedMessage id="pages.login.relatedLinks" defaultMessage="相关链接" />
            <a href="https://iotdb.apache.org/zh/" target="_blank"><ReadOutlined className={styles.icon} /></a>
            <a href="https://github.com/apache/iotdb" target="_blank"><GithubOutlined className={styles.icon} /></a>
          </Space>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
