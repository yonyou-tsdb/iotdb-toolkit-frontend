import ProForm,{
  ModalForm,
  ProFormSelect,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import React, { useState } from 'react';
import styles from '../style.less';
import { Button, Result, Table, Tag, Space, Checkbox, Popover, Modal, Popconfirm, Select, Form, notification } from 'antd';
import { useRequest, useModel, useIntl } from 'umi';
import DateUtil from '../../../../utils/DateUtil';
import { addStorageGroupWithTenantUsingPOST } from '@/services/swagger1/iotDbController';
const AddStorageModal = (props) => {
  const intl = useIntl();
  const { addModalVisible, setAddModalVisible, initItem, searchContent, onDone, } = props;
  const { getMillisecondFromTimeunit } = DateUtil;
  const [form] = Form.useForm();
  if (!addModalVisible) {
    return null;
  }
  return (
    <ModalForm
      form={form}
      visible={addModalVisible}
      title={intl.formatMessage({id: 'createStorageGroup.storageGroup.create',})}
      modalProps={{
        onCancel: () => setAddModalVisible(false),
        destroyOnClose: true,
        bodyStyle: !addModalVisible
          ? {
              padding: '72px 0',
            }
          : {},
      }}
      onFinish={async (values)=>{
        try {
          await form.validateFields();
          let ttl = form.getFieldValue('ttl');
          if(ttl != null){
            const timeunit = form.getFieldValue('timeunit');
            ttl = getMillisecondFromTimeunit(ttl, timeunit);
          }
          let ret = await addStorageGroupWithTenantUsingPOST({name:'root.' + values.name, ttl: ttl});
          if(ret.code == '0'){
            onDone(values);
            notification.success({
              message: 'Add Storage Group root.' + values.name + ' Success',
            });
            setAddModalVisible(false);
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
        name="name"
        label={intl.formatMessage({id: 'createStorageGroup.storageGroup.name',})}
        rules={[
          {
            required: true,
            message: 'Between 1 to 255 character',
            max: 255,
            type: 'string',
          },
          {
            pattern: /^(?!\.)[a-zA-Z0-9.\u4e00-\u9fa5_]+$/,
            message: intl.formatMessage({id: 'createStorageGroup.entity.rule',}),
          },
        ]}
        fieldProps={{
          addonBefore: 'root.',
          style:{  }
        }}
      />
      <ProForm.Group size={8}>
        <ProFormDigit
          name="ttl"
          label={intl.formatMessage({id: 'createStorageGroup.ttl.text',})}
          rules={[
            {
              min: 0,
              max: 925879189194932,
              type: 'number',
            },
          ]}
          fieldProps={{
            style:{  }
          }}
        />
        <ProFormSelect
          label={intl.formatMessage({id: 'createStorageGroup.ttl.timeUnit',})}
          name="timeunit"
          rules={[
            {
              validator: (rule, value, callback) => {
                if((form.getFieldValue('ttl')==null&&value!=null) || (form.getFieldValue('ttl')!=null&&value==null)){
                  callback(intl.formatMessage({id: 'createStorageGroup.ttl.rule',}));
                  return;
                }
                callback();
              },
            },
          ]}
          options={[
            {
              label: intl.formatMessage({id: 'createStorageGroup.ttl.second',}),
              value: 's',
            },
            {
              label: intl.formatMessage({id: 'createStorageGroup.ttl.minute',}),
              value: 'm',
            },
            {
              label: intl.formatMessage({id: 'createStorageGroup.ttl.hour',}),
              value: 'h',
            },
            {
              label: intl.formatMessage({id: 'createStorageGroup.ttl.day',}),
              value: 'd',
            },
            {
              label: intl.formatMessage({id: 'createStorageGroup.ttl.year',}),
              value: 'y',
            },
          ]}
          fieldProps={{
            style:{  }
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default AddStorageModal;
