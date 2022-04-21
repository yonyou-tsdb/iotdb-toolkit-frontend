import { useState, useEffect, useRef } from 'react';
import { Form, Button, Col, Input, Popover, Progress, Row, Select, message, notification } from 'antd';
import { LockOutlined, } from '@ant-design/icons';
import { Link, useRequest, history, useIntl } from 'umi';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { registerUsingPOST } from '@/services/swagger1/userController';
import styles from './style.less';
import defaultCaptchaImg from '../../../assets/captcha-pure.png';
import { v4 as uuid } from 'uuid';
import md5 from 'js-md5';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const Register = () => {
  const intl = useIntl();
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [prefix, setPrefix] = useState('86');
  const [popover, setPopover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const initToken = uuid().replaceAll('-','');
  const [token, setToken] = useState(initToken);
  const tokenRef = useRef(initToken);
  useEffect(() => {
    tokenRef.current = token
  }, [token]);
  const [captchaUrl, setCaptchaUrl] = useState(
    '../../api/acquireCaptcha?token='+initToken
  );
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const onFinish = async (values) => {
    setSubmitting(true);
    changeCaptchaToDefault();
    let tokenRefCurrent = tokenRef.current;
    setToken(null);
    values.password = md5(values.password);
    let ret = await registerUsingPOST({...values, token: tokenRefCurrent});
    if(ret.code=='0'){
      notification.success({
        message: intl.formatMessage({
          id: 'account.register.emailNotice',
        }),
      });
    }else{
      notification.error({
        message: ret.message,
      });
    }
    setSubmitting(false);
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(intl.formatMessage({
        id: 'account.setting.password.confirm.error',
      }));
    }

    return promise.resolve();
  };

  const checkToken = (_, value) => {
    const promise = Promise;
    if (value == null) {
      return promise.reject(intl.formatMessage({
        id: 'pages.login.captcha.placeholder',
      }));
    }
    if (value.length > 20) {
      return promise.reject(intl.formatMessage({
        id: 'account.captcha.tooLong',
      }));
    }
    if (token == null) {
      return promise.reject(intl.formatMessage({
        id: 'account.captcha.get',
      }));
    }

    return promise.resolve();
  };

  const changeCaptcha = () => {
    let tabToken = uuid().replaceAll('-','');
    setToken(tabToken);
    setCaptchaUrl(location.pathname.endsWith('/')?
      '../../api/acquireCaptcha?token='+tabToken:
      '../api/acquireCaptcha?token='+tabToken
    );
  }

  const changeCaptchaToDefault = () => {
    setCaptchaUrl(defaultCaptchaImg);
  }

  return (
    <div className={styles.main}>
      <h3>{intl.formatMessage({id: 'pages.login.registerAccount',})}</h3>
      <ProForm form={form} name="UserRegister" onFinish={onFinish}
      submitter={{
        render: (_, dom) => {},
      }}
      >
        <ProFormText
          label={intl.formatMessage({id: 'account.account.text',})}
          name="username"
          fieldProps={{
          }}
          rules={[
            {
              max: 12,
              min: 4,
              required: true,
            },
            {
              pattern: /^(?!_)[a-zA-Z0-9_]+$/,
              message: intl.formatMessage({id: 'account.username.rule',}),
            },
          ]}
        >
        </ProFormText>
        <ProFormText
          label={intl.formatMessage({id: 'account.email.text',})}
          name="mail"
          rules={[
            {
              max: 100,
            },
            {
              required: true,
            },
            {
              type: 'email',
            },
          ]}
        >
        </ProFormText>

          <ProFormText.Password
            label={intl.formatMessage({id: 'account.password.text',})}
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            fieldProps={{
              visibilityToggle: false,
            }}
            rules={[
              {
                pattern: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16})/,
                message: intl.formatMessage({id: 'account.setting.password.rule',}),
              },
              {
                max: 16,
                required: true,
              }
            ]}
          >
          </ProFormText.Password>
        <ProFormText.Password
          label={intl.formatMessage({id: 'account.setting.password.confirm',})}
          name="confirm"
          fieldProps={{
            visibilityToggle: false,
          }}
          rules={[
            {
              max: 16,
              required: true,
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
        </ProFormText.Password>
        <Row gutter={8}>
          <Col span={16}>
            <ProFormText
              name="captcha"
              placeholder={intl.formatMessage({
                id: 'pages.login.captcha.placeholder',
              })}
              rules={[
                {
                  validator: checkToken,
                },
              ]}
            >
            </ProFormText>
          </Col>
          <Col span={8}>
            <img
                  title={intl.formatMessage({
                    id: 'pages.login.captcha.rule',
                  })}
                  src={captchaUrl}
                  style={{float: 'right',  cursor: 'pointer', width: 118, height: 30}}
                  onClick={()=>{changeCaptcha()}}
                />
          </Col>
        </Row>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"

          >
            <span>{intl.formatMessage({id: 'pages.login.registerAccount',})}</span>
          </Button>
          <Link className={styles.login} to="/user/login/">
            <span>{intl.formatMessage({id: 'account.login.back',})}</span>
          </Link>
        </FormItem>
      </ProForm>
    </div>
  );
};

export default Register;
