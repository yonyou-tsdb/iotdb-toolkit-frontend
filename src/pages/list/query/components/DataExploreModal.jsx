import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormRadio,
  ProForm,
} from '@ant-design/pro-form';
import { CloseCircleFilled, ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styles from '../style.less';
import { Input, Button, Result, Table, Tag, Space, Checkbox, Popover, Modal, Popconfirm, Select, Form,
  notification, Descriptions, Col, Row, Radio, Upload, message } from 'antd';
const { Search, TextArea } = Input;
import { useRequest, useModel, useIntl } from 'umi';
import moment from 'moment';
import CommonUtil from '../../../../utils/CommonUtil';
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, setVisible, columnName, setColumnName, quantity,
   average, max, min, variance, standardDeviation } = props;
  const [form] = Form.useForm();
  if (!visible) {
    return null;
  }
  return (
    <ModalForm
      visible={visible}
      form={form}
      title={intl.formatMessage({id: 'query.result.dataExplore',}) +
        " -- " + columnName}
      className={styles.standardListForm}
      column={2}
      submitter={{
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
          ];
        },

      }}
      modalProps={{
        onCancel: () => {
          setVisible(false)
        },
        destroyOnClose: true,
        bodyStyle: done
          ? {
              padding: '72px 0',
            }
          : {},
      }}
    >
    <Row gutter={16}>
      <Col lg={12} md={24} sm={48}>
        <ProFormText
          name="name"
          label={intl.formatMessage({id: 'query.result.dataExplore.quantity',})}
          value={quantity}
          placeholder=''
          fieldProps={{
            readOnly: 'readOnly',
          }}
        />
      </Col>
      <Col lg={12} md={24} sm={48}>
        <ProFormText
          name="name"
          label={intl.formatMessage({id: 'query.result.dataExplore.average',})}
          value={average}
          disabled={window.isNaN(average) ? true : false}
          placeholder=''
          fieldProps={{
            readOnly: 'readOnly',
          }}
        />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col lg={12} md={24} sm={48}>
        <ProFormText
          name="name"
          label={intl.formatMessage({id: 'query.result.dataExplore.max',}) +
          (window.isNaN(max.value) ? '':(' -- ' +
            intl.formatMessage({id: 'query.result.dataExplore.firstAppearedIn',}) +
            ' Time = ' + max.time))
          }
          value={max.value}
          disabled={window.isNaN(max.value) ? true : false}
          placeholder=''
          fieldProps={{
            readOnly: 'readOnly',
          }}
        />
      </Col>
      <Col lg={12} md={24} sm={48}>
        <ProFormText
          name="name"
          label={intl.formatMessage({id: 'query.result.dataExplore.min',}) +
          (window.isNaN(min.value) ? '':(' -- ' +
            intl.formatMessage({id: 'query.result.dataExplore.firstAppearedIn',}) +
            ' Time = ' + min.time))
          }
          value={min.value}
          disabled={window.isNaN(min.value) ? true : false}
          placeholder=''
          fieldProps={{
            readOnly: 'readOnly',
          }}
        />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col lg={12} md={24} sm={48}>
        <ProFormText
          name="name"
          label={intl.formatMessage({id: 'query.result.dataExplore.variance',})}
          value={variance}
          disabled={window.isNaN(variance) ? true : false}
          placeholder=''
          fieldProps={{
            readOnly: 'readOnly',
          }}
        />
      </Col>
      <Col lg={12} md={24} sm={48}>
        <ProFormText
          name="name"
          label={intl.formatMessage({id: 'query.result.dataExplore.standardDeviation',})}
          value={standardDeviation}
          disabled={window.isNaN(standardDeviation) ? true : false}
          placeholder=''
          fieldProps={{
            readOnly: 'readOnly',
          }}
        />
      </Col>
    </Row>
    </ModalForm>
  );
};

export default OperationModal;
