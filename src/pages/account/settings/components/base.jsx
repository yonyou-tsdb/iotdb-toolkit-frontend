import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message, Form, notification } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { history, useModel, useIntl, useRequest  } from 'umi';
import { updatePasswordUsingPOST } from '@/services/swagger1/userController';
import md5 from 'js-md5';
import styles from './BaseView.less';

const BaseView = () => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [form] = Form.useForm();
  const handleFinish = async (values) => {
    const encodePasswordOrigin = md5(values.passwordOrigin);
    const encodePassword = md5(values.password);
    let ret = await updatePasswordUsingPOST({passwordOrigin:encodePasswordOrigin,
       password: encodePassword});
    if(ret.code=='0'){
     notification.success({
       message: intl.formatMessage({id: 'account.setting.password.success',}),
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
      return promise.reject(intl.formatMessage({
        id: 'account.setting.password.confirm.error',
      }));
    }

    return promise.resolve();
  };
  return (
    <div className={styles.baseView}>
      {(
        <>
          <div className={styles.left}>
            <ProForm
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: '',
                  },
                },
              }}
              initialValues={{ ...currentUser }}
              hideRequiredMark
            >
            <ProFormText.Password
              label={intl.formatMessage({id: 'account.setting.password.old',})}
              name="passwordOrigin"
              initialValue=" "
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
                label={intl.formatMessage({id: 'account.setting.password.new',})}
                name="password"
                initialValue=" "
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
            </ProForm>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
