import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import React, { useState } from 'react';
import styles from '../style.less';
import { Button, Result, Table, Tag, Space, Checkbox, Popover, Modal, Popconfirm, Select, Form, notification } from 'antd';
import { useRequest, useModel, useIntl } from 'umi';
import { addUserWithTenantUsingPOST } from '@/services/swagger1/iotDbController';
const AddUserModal = (props) => {
  const intl = useIntl();
  const { addUserVisible, setAddUserVisible, initUser, searchContent } = props;
  const [form] = Form.useForm();
  if (!addUserVisible) {
    return null;
  }
  return (
    <ModalForm
      form={form}
      visible={addUserVisible}
      title={intl.formatMessage({id: 'manageUser.create.title',})}
      modalProps={{
        onCancel: () => setAddUserVisible(false),
        destroyOnClose: true,
        bodyStyle: !addUserVisible
          ? {
              padding: '72px 0',
            }
          : {},
      }}
      onFinish={async (values)=>{
        try {
          await form.validateFields();
          let ret = await addUserWithTenantUsingPOST({user:values.userName, password:values.userPassword});
          if(ret.code == '0'){
            initUser(searchContent);
            notification.success({
              message: 'Add User ' + values.userName + ' Success',
            });
            setAddUserVisible(false);
          }else{
            notification.error({
              message: ret.message,
            });
          }
        } catch (e) {
        }
      }}
    >
      <ProFormText
        name="userName"
        label={intl.formatMessage({id: 'manageUser.create.username',})}
        rules={[
          {
            required: true,
            message: 'Between 4 to 255 character',
            min: 4,
            max: 255,
            type: 'string',
          },
        ]}
      />
      <ProFormText.Password
        name="userPassword"
        label={intl.formatMessage({id: 'manageUser.create.password',})}
        rules={[
          {
            required: true,
            message: 'Between 4 to 255 character',
            min: 4,
            max: 255,
            type: 'string',
          },
        ]}
      />
    </ModalForm>
  );
};

export default AddUserModal;
