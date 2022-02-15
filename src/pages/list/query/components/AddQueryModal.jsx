import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { CloseCircleFilled, ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styles from '../style.less';
import { Input, Button, Result, Table, Tag, Space, Checkbox, Popover, Modal, Popconfirm, Select, Form, notification } from 'antd';
const { Search, TextArea } = Input;
import { useRequest, useModel, useIntl } from 'umi';
import { querySaveUsingPOST } from '@/services/swagger1/queryController';
import moment from 'moment';
import CommonUtil from '../../../../utils/CommonUtil';
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, setVisible, querySql, activeQueryTabkey, } = props;
  const [form] = Form.useForm();
  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(async() => {
  });
  const saveQuery = async(name) => {
    let ret = await querySaveUsingPOST({sqls: querySql[activeQueryTabkey], name: name});
    CommonUtil.dealCallback(ret, (ret_)=>{
      notification.success({
        message: intl.formatMessage({id: 'query.sql.script.save.success',}) + ' ' + name,
      });
      setVisible(false);
    }, notification);
  }
  if (!visible) {
    return null;
  }
  return (
    <ModalForm
      visible={visible}
      form={form}
      title={intl.formatMessage({id: 'query.sql.script.create',})}
      className={styles.standardListForm}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
          ];
        },

      }}
      onFinish={(values)=>{
        saveQuery(values.name);
      }}
      modalProps={{
        onCancel: () => setVisible(false),
        destroyOnClose: true,
        bodyStyle: done
          ? {
              padding: '72px 0',
            }
          : {},
      }}
    >
      <ProFormText
        name="name"
        label={intl.formatMessage({id: 'query.sql.script.name',})}
        rules={[
          {
            required: true,
          },
        ]}
      />
    </ModalForm>
  );
};

export default OperationModal;
