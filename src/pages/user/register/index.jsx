import { useState, useEffect, useRef } from 'react';
import { Form, Button, Col, Input, Popover, Progress, Row, Select, message, notification } from 'antd';
import { Link, useRequest, history, useIntl } from 'umi';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { registerUsingPOST } from '@/services/swagger1/userController';
import styles from './style.less';
import defaultCaptchaImg from '../../../assets/captcha-pure.png';
import { v4 as uuid } from 'uuid';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

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
  const [captchaUrl, setCaptchaUrl] = useState('../api/acquireCaptcha?token='+initToken);
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const onFinish = async (values) => {
    if(token == null){
      return;
    }
    changeCaptchaToDefault();
    let tokenRefCurrent = tokenRef.current;
    setToken(null);
    let ret = await registerUsingPOST({...values, token: tokenRefCurrent});
    console.log(ret);
    if(ret.code=='0'){
      notification.success({
        message: '注册邮件已经发送至邮箱中，请您于24小时内激活账号',
      });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }

    return promise.resolve();
  };

  const changeCaptcha = () => {
    let tabToken = uuid().replaceAll('-','');
    setToken(tabToken);
    setCaptchaUrl('../api/acquireCaptcha?token='+tabToken);
  }

  const changeCaptchaToDefault = () => {
    setCaptchaUrl(defaultCaptchaImg);
  }

  return (
    <div className={styles.main}>
      <h3>注册</h3>
      <ProForm form={form} name="UserRegister" onFinish={onFinish}
      submitter={{
        render: (_, dom) => {},
      }}
      >
        <ProFormText
          label="账号"
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
          label="邮箱"
          name="mail"
          rules={[
            {
              max: 100,
            },
            {
              required: true,
              message: '请输入邮箱地址!',
            },
            {
              type: 'email',
              message: '邮箱地址格式错误!',
            },
          ]}
        >
        </ProFormText>

          <ProFormText.Password
            label="密码"
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                pattern: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16})/,
                message: '请输入至少8位包含数字和大小写字母的密码',
              },
              {
                max: 16,
                required: true,
              }
            ]}
          >
          </ProFormText.Password>
        <ProFormText.Password
          label="密码确认"
          name="confirm"
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
              placeholder='请输入验证码'
              rules={[
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ]}
            >
            </ProFormText>
          </Col>
          <Col span={8}>
            <img
                  title={'点击刷新验证码'}
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
            <span>注册</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>使用已有账户登录</span>
          </Link>
        </FormItem>
      </ProForm>
    </div>
  );
};

export default Register;
