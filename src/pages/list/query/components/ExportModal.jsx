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
  notification, Descriptions, Col, Row, Radio } from 'antd';
const { Search, TextArea } = Input;
import { useRequest, useModel, useIntl } from 'umi';
import { querySaveUsingPOST } from '@/services/swagger1/queryController';
import moment from 'moment';
import CommonUtil from '../../../../utils/CommonUtil';
import {UnControlled as CodeMirror2} from '../../../../../node_modules/react-codemirror2'
import '../../../../../node_modules/codemirror/lib/codemirror.css';
import '../../../../utils/iotdb-sql/iotdb-sql';
import '../../../../../node_modules/codemirror/theme/juejin.css';
import '../../../../../node_modules/codemirror/addon/hint/show-hint.css';
import '../../../../../node_modules/codemirror/addon/hint/show-hint';
import '../../../../../node_modules/codemirror/addon/hint/sql-hint';
import '../../../../../node_modules/codemirror/addon/comment/comment';
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, setVisible, exportCsv, activeQueryTabkey, initExportSql } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const [exportName, setExportName] = React.useState(undefined);
  const [exportSql] = useState({'query1':'select * from root'});
  const [exportTF, setExportTF] = React.useState('number');
  const [exportZone, setExportZone] = React.useState('+08:00');
  const [timeZoneDisabled, setTimeZoneDisabled] = React.useState(true);
  const [compress, setCompress] = React.useState('plain');
  const [form] = Form.useForm();
  const exportCodeMirror = (
    <CodeMirror2
      value={exportSql['query1']}
      options={{
        mode: 'text/iotdb-sql',
        theme: 'juejin',
        autofocus: false,
        lineNumbers: true,
        tabindex: 1,
        extraKeys: {"Alt-/": "autocomplete", "Ctrl-/": "toggleComment"},
        matchBrackets: true,
        indentWithTabs: true,
        smartIndent: true,
        hintOptions: {
          completeSingle: false
        },
      }}
      onChange={(editor, data, value) => {
        if(data.origin!=null&&((data.removed[0].trim()!='') || data.text[0].match(/^[a-zA-Z0-9_]+$/)) ){
          editor.showHint();
        }
        // setExportSql(value);
        exportSql['query1'] = value;
      }}
    />
  );
  if (!visible) {
    return null;
  }
  return (
    <ModalForm
      visible={visible}
      form={form}
      title={intl.formatMessage({id: 'query.sql.export',})}
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
            <Button type='primary'
              key="export"
              onClick={() => {
                exportCsv({queryCommand:exportSql['query1'], targetFile:exportName,
                  timeformat:exportTF, timeZone:exportZone, compress:compress});
              }}
            >
              {intl.formatMessage({id: 'query.sql.export',})}
            </Button>
            ,
          ];
        },

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
      <div style={{
        marginBottom: 10,
      }}>{intl.formatMessage({id: 'query.sql.export.sqlWithRequired',})}</div>
      <div style={{
        marginBottom: 20,
      }}>{exportCodeMirror}</div>
    <Row gutter={16}>
      <Col lg={12} md={24} sm={48}>
      <ProFormText
        name="name"
        label={intl.formatMessage({id: 'query.sql.export.backupNameWithOptional',})}
        placeholder='dump'
        fieldProps={{
          value: exportName,
          onChange: (e) => {
            setExportName(e.target.value);
          }
        }}
      />
      </Col>
      <Col lg={10} md={20} sm={40}>
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
      </Row>
      <Row gutter={16}>
        <Col lg={12} md={24} sm={48}>
        <ProFormRadio.Group
            name="tf"
            label={intl.formatMessage({id: 'query.sql.export.timeFormat',})}
            radioType="button"
            size='small'
            options={[
              {
                label: intl.formatMessage({id: 'query.sql.export.timeFormat.number',}),
                value: 'number',
              },
              {
                label: intl.formatMessage({id: 'query.sql.export.timeFormat.default',}),
                value: 'default',
              },
              {
                label: intl.formatMessage({id: 'query.sql.export.timeFormat.timestamp',}),
                value: "yyyy-MM-dd HH:mm:ss.SSS",
              },
            ]}
            initialValue={exportTF}
            fieldProps={{
              buttonStyle:'solid',
              onChange: (key)=> {
                if(key.target.value=='number'){
                  setTimeZoneDisabled(true);
                }else{
                  setTimeZoneDisabled(false);
                }
                setExportTF(key.target.value);
              }
            }}
          />
        </Col>
        <Col lg={10} md={20} sm={40}>
        <ProFormSelect
          label={intl.formatMessage({id: 'query.sql.export.timeZone',})}
          name='zone'
          disabled={timeZoneDisabled}
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
