import { GithubOutlined, ReadOutlined, LockOutlined, TaobaoCircleOutlined, UserOutlined,
  WeiboCircleOutlined, MailOutlined, EditOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, notification, Checkbox, Form, Row, Col } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { loginAccountUsingPOST } from '@/services/swagger1/userController';
import styles from './index.less';
import defaultCaptchaImg from '../../../assets/captcha-pure.png';
import { v4 as uuid } from 'uuid';
import CookieUtil from '../../../utils/CookieUtil';
const defaultUsername = "admin";
const Login = () => {
  const { getItem, addItem } = CookieUtil;
  const { initialState, setInitialState } = useModel('@@initialState');
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const initToken = uuid().replaceAll('-','');
  const [token, setToken] = useState(initToken);
  const tokenRef = useRef(initToken);
  useEffect(() => {
    tokenRef.current = token
  }, [token]);
  const [captchaUrl, setCaptchaUrl] = useState('../api/acquireCaptcha?token='+tokenRef.current);
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
      console.log(values);
      let msg = await loginAccountUsingPOST({ ...values, type });
      let errorMsg = msg.message;
      msg = msg.data == null ? msg : msg.data;
      if (msg.status === 'ok') {
        if(msg.defaultConnect==null){
          const defaultloginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success-without-tenant',
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
      });
      notification.error({
        message: defaultloginFailureMessage,
        description: errorMsg,
      });
      // setUserLoginState(msg);
    } catch (error) {
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
      });
      message.error(defaultloginFailureMessage);
    }

    setSubmitting(false);
  };
  const changeCaptcha = () => {
    let tabToken = uuid().replaceAll('-','');
    setToken(tabToken);
    setCaptchaUrl('../api/acquireCaptcha?token='+tabToken);
  }

  const changeCaptchaToDefault = () => {
    setCaptchaUrl(defaultCaptchaImg);
  }
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
                  id: type === 'account'?'pages.login.submit':'pages.reset.submit',
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
              if(type === 'account'){
                handleSubmit(values);
              }else{
                console.log(values)
              }
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
                key="reset"
                tab={intl.formatMessage({
                  id: 'pages.login.forgotPassword',
                })}
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
                        />
                      ),
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'reset' && <LoginMessage content="验证码错误" />}
            {type === 'reset' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MailOutlined className={styles.prefixIcon} />,
                  }}
                  name="email"
                  placeholder={intl.formatMessage({
                    id: 'pages.reset.email.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.reset.email.placeholder"
                        />
                      ),
                    },
                    {
                      type: 'email',
                      message: (
                        <FormattedMessage
                          id="pages.reset.email.invalid"
                        />
                      ),
                    },
                  ]}
                />
              <Row gutter={8}>
                <Col span={16}>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <EditOutlined className={styles.prefixIcon} />,
                  }}
                  name="captcha"
                  placeholder='请输入验证码'
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码',
                    },
                  ]}
                >
                </ProFormText>
                </Col>
                <Col span={8}>
                <img
                  title={'点击刷新验证码'}
                  src={type === 'reset'?captchaUrl:defaultCaptchaImg}
                  style={{float: 'right',  cursor: 'pointer', width: 108, height: 39}}
                  onClick={()=>{changeCaptcha()}}
                />
                </Col>
              </Row>
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
