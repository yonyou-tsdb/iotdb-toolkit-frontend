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
import { querySaveUsingPOST } from '@/services/swagger1/queryController';
import moment from 'moment';
import CommonUtil from '../../../../utils/CommonUtil';
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, setVisible, activeQueryTabkey } = props;
  const [timer, setTimer] = React.useState(undefined);
  const [exportZone, setExportZone] = React.useState('+08:00');
  const [compress, setCompress] = React.useState('plain');
  const [waitingSecond, setWaitingSecond] = React.useState(0);
  const [lockForImport, setLockForImport] = React.useState(false);
  const [form] = Form.useForm();
  if (!visible) {
    return null;
  }
  return (
    <ModalForm
      visible={visible}
      form={form}
      title={intl.formatMessage({id: 'query.sql.import',})}
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
            <Upload
              action='/api/query/importCsv'
              name="Filedata"
              showUploadList={false}
              key="upload"
              data={{compress:compress, timeZone:exportZone}}
              beforeUpload={(file)=>{
                const fileName= file.name;
                const fileType = fileName.substring(fileName.lastIndexOf('.'));
                const fileSize = file.size;
                const size = 3;
                let fileSizeMbNum = Math.ceil(fileSize/1024/1024);
                let waitingSecondEstimated = Math.ceil(fileSizeMbNum*10);
                if(compress=='plain'&&fileType!='.csv'){
                  notification.error({message:
                    intl.formatMessage({id: 'query.sql.import.compression.no.rule',})});
                  return false;
                }
                if(compress=='snappy'&&fileType!='.snappy'){
                  notification.error({message:
                    intl.formatMessage({id: 'query.sql.import.compression.snappy.rule',})});
                  return false;
                }
                if(compress=='gzip'&&fileType!='.gz'){
                  notification.error({message:
                    intl.formatMessage({id: 'query.sql.import.compression.gzip.rule',})});
                  return false;
                }
                if (fileSizeMbNum>size) {
                  notification.error({message:
                    intl.formatMessage({id: 'query.sql.import.size.rule',}) + ' ' + size + ' MB'});
                  return false;
                }
                // setLockForImport(true);
                return true;
              }}
              onChange={
                (info)=>{if(info.file.response != null){
                  setLockForImport(false);
                  // clearCountDown(timer);
                  if(info.file.response.code != '0' || info.file.status == 'error'){
                    notification.error({
                      message: info.file.response.message,
                    });
                  }
                }}
              }
              withCredentials={true}
            >
            <Button type='primary'
              key="import"
            >
              {intl.formatMessage({id: 'query.sql.import.selectFile',})}
            </Button>
            </Upload>,
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
        <ProFormRadio.Group
          name="compress"
          label={intl.formatMessage({id: 'query.sql.export.compressionMode',})}
          radioType="button"
          size='small'
          options={[
            {
              label: intl.formatMessage({id: 'query.sql.export.compression.no',}),
              value: 'plain',
            },
            {
              label: 'GZIP',
              value: 'gzip',
            },
            {
              label: 'SNAPPY',
              value: 'snappy',
            },
          ]}
          initialValue={compress}
          fieldProps={{
            buttonStyle:'solid',
            onChange: (key)=> {
              setCompress(key.target.value);
            }
          }}
        />
      </Col>
      <Col lg={10} md={20} sm={40}>
      <ProFormSelect
        label={intl.formatMessage({id: 'query.sql.export.timeZone',})}
        tooltip={intl.formatMessage({id: 'query.sql.export.timeZone.description',})}
        name='zone'
        options={[
          {
            label: '-12:00',
            value: '-12:00',
          },
          {
            label: '-11:00',
            value: '-11:00',
          },
          {
            label: '-10:00',
            value: '-10:00',
          },
          {
            label: '-09:00',
            value: '-09:00',
          },
          {
            label: '-08:00',
            value: '-08:00',
          },
          {
            label: '-07:00',
            value: '-07:00',
          },
          {
            label: '-06:00',
            value: '-06:00',
          },
          {
            label: '-05:00',
            value: '-05:00',
          },
          {
            label: '-04:00',
            value: '-04:00',
          },
          {
            label: '-03:00',
            value: '-03:00',
          },
          {
            label: '-02:00',
            value: '-02:00',
          },
          {
            label: '-01:00',
            value: '-01:00',
          },
          {
            label: '+00:00',
            value: '+00:00',
          },
          {
            label: '+01:00',
            value: '+01:00',
          },
          {
            label: '+02:00',
            value: '+02:00',
          },
          {
            label: '+03:00',
            value: '+03:00',
          },
          {
            label: '+04:00',
            value: '+04:00',
          },
          {
            label: '+05:00',
            value: '+05:00',
          },
          {
            label: '+06:00',
            value: '+06:00',
          },
          {
            label: '+07:00',
            value: '+07:00',
          },
          {
            label: '+08:00',
            value: '+08:00',
          },
          {
            label: '+09:00',
            value: '+09:00',
          },
          {
            label: '+10:00',
            value: '+10:00',
          },
          {
            label: '+11:00',
            value: '+11:00',
          },
          {
            label: '+12:00',
            value: '+12:00',
          },
        ]}
        initialValue='+08:00'
        fieldProps={{
          value: exportZone,
          allowClear:false,
          onChange: (key)=> {setExportZone(key);}
        }}
      />
      </Col>
    </Row>
    </ModalForm>
  );
};

export default OperationModal;
