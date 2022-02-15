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
import { editUserWithTenantUsingPOST } from '@/services/swagger1/iotDbController';
const EditUserModal = (props) => {
  const intl = useIntl();
  const { editUserVisible, setEditUserVisible, editUser } = props;
  const [form] = Form.useForm();
  if (!editUserVisible) {
    return null;
  }
  return (
    <ModalForm
      form={form}
      visible={editUserVisible}
      title={intl.formatMessage({id: 'manageUser.edit.title',})}
      modalProps={{
        onCancel: () => setEditUserVisible(false),
        destroyOnClose: true,
        bodyStyle: !editUserVisible
          ? {
              padding: '72px 0',
            }
          : {},
      }}
      onFinish={async (values)=>{
        try {
          await form.validateFields();
          let ret = await editUserWithTenantUsingPOST({user:editUser.user, password:values.userPassword});
          if(ret.code == '0'){
            notification.success({
              message: 'Edit User ' + values.userName + ' Success',
            });
            setEditUserVisible(false);
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
        label={intl.formatMessage({id: 'manageUser.create.username',})}
        fieldProps={{
          defaultValue: editUser.user,
          disabled: 'disabled',
        }}
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

export default EditUserModal;
