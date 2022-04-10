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

  const onFinish = async (values) => {
    setSubmitting(true);
    values.password = md5(values.password);
    let ret = await resetUpdatePasswordUsingPOST({password:values.password, id:id, token:token});
    if(ret.code=='0'){
      notification.success({
        message: intl.formatMessage({id: 'account.setting.password.success',}),
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

  return (
    <div className={styles.main}>
      <h3>{intl.formatMessage({id: 'account.setting.password',})}</h3>
      <ProForm form={form} name="UpdatePassword" onFinish={onFinish}
      submitter={{
        render: (_, dom) => {},
      }}
      >
        <ProFormText
          label={intl.formatMessage({id: 'account.account.text',})}
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
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"

          >
            <span>{intl.formatMessage({id: 'account.setting.password',})}</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>{intl.formatMessage({id: 'account.login.back',})}</span>
          </Link>
        </FormItem>
      </ProForm>
    </div>
  );
};

export default ResetPassword;
