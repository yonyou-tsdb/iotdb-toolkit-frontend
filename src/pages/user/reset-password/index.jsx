import { useState, useEffect, useRef } from 'react';
import { Form, Button, Col, Input, Popover, Progress, Row, Select, message, notification } from 'antd';
import { LockOutlined, } from '@ant-design/icons';
import { Link, useRequest, history, useIntl } from 'umi';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { resetUpdatePasswordUsingPOST } from '@/services/swagger1/userController';
import styles from './style.less';
import defaultCaptchaImg from '../../../assets/captcha-pure.png';
import { v4 as uuid } from 'uuid';
import md5 from 'js-md5';
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

const ResetPassword = ({ location }) => {
  const username = location.query.username;
  const id = location.query.id;
  const token = location.query.token;
  const intl = useIntl();
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [prefix, setPrefix] = useState('86');
  const [popover, setPopover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);
    values.password = md5(values.password);
    console.log({password:values.password, id:id, token:token});
    let ret = await resetUpdatePasswordUsingPOST({password:values.password, id:id, token:token});
    console.log(ret.code)
    if(ret.code=='0'){
      notification.success({
        message: '密码修改成功',
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
      return promise.reject('两次输入的密码不匹配!');
    }

    return promise.resolve();
  };

  return (
    <div className={styles.main}>
      <h3>修改密码</h3>
      <ProForm form={form} name="UpdatePassword" onFinish={onFinish}
      submitter={{
        render: (_, dom) => {},
      }}
      >
        <ProFormText
          label="账号"
          fieldProps={{
            readOnly: 'readOnly',
            value: username,
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

          <ProFormText.Password
            label="密码"
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
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"

          >
            <span>提交</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>返回登录页面</span>
          </Link>
        </FormItem>
      </ProForm>
    </div>
  );
};

export default ResetPassword;
