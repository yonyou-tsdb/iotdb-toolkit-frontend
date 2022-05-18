import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormDigit,
} from '@ant-design/pro-form';
import React, { useState } from 'react';
import styles from '../style.less';
import { Button, Result, Table, Tag, Space, Checkbox, Popover, Modal, Popconfirm, Select, Form, notification } from 'antd';
import { useRequest, useModel, useIntl } from 'umi';
import DateUtil from '../../../../utils/DateUtil';
import { editStorageGroupWithTenantUsingPOST } from '@/services/swagger1/iotDbController';
const EditStorageModal = (props) => {
  const intl = useIntl();
  const { getStringFromMillisecond, getMillisecondFromTimeunit } = DateUtil;
  const { editModalVisible, setEditModalVisible, editItem, initItem, searchContent, onDone } = props;
  const [form] = Form.useForm();
  if (!editModalVisible) {
    return null;
  }
  return (
    <ModalForm
      form={form}
      visible={editModalVisible}
      title={intl.formatMessage({id: 'createStorageGroup.ttl.edit',})}
      modalProps={{
        onCancel: () => setEditModalVisible(false),
        destroyOnClose: true,
        bodyStyle: !editModalVisible
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
          let ret = await editStorageGroupWithTenantUsingPOST({
            name:editItem.value, ttl: ttl,
            umi_locale: localStorage.getItem("umi_locale"),
          });
          if(ret.code == '0'){
            console.log(values);
            onDone({name:editItem.value, ...values});
            notification.success({
              message: 'Edit Storage Group ' + editItem.value + ' Success',
            });
            setEditModalVisible(false);
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
        fieldProps={{
          value: editItem.value,
          disabled: 'disabled',
          // style:{ width: 750 }
        }}
      />
      <ProFormText
        label={intl.formatMessage({id: 'createStorageGroup.ttl.current',})}
        fieldProps={{
          defaultValue: getStringFromMillisecond(editItem.ttl),
          disabled: 'disabled',
          placeholder: intl.formatMessage({id: 'createStorageGroup.ttl.unlimited',}),
          // style:{ width: 750 }
        }}
      />
      <ProForm.Group size={8}>
        <ProFormDigit
          name="ttl"
          label={intl.formatMessage({id: 'createStorageGroup.ttl.new',})
            + ' ' + intl.formatMessage({id: 'createStorageGroup.ttl.new.description',})
          }
          rules={[
            {
              min: 1,
              max: 925879189194932,
              type: 'number',
            },
          ]}
          fieldProps={{
            // style:{ width: 540 }
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
            // style:{ width: 200 }
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default EditStorageModal;
