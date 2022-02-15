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
import { Input, Button, Result, Table, Tag, Space, Checkbox, Popover, Modal, Popconfirm, Select, Form,
  notification } from 'antd';
import { useRequest, useModel, useIntl } from 'umi';
import { addTimeseriesWithTenantUsingPOST } from '@/services/swagger1/iotDbController';
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, current, setCurrent, onDone, children, editable, setEditable, changeState, createable,
    setCreateable, onDeleteItem, refresh, currentSchema, currentValue, searchTimeseries, searchContent,
    setSearchContent, } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const dataTypeArray = ['BOOLEAN', 'INT32', 'INT64', 'FLOAT', 'DOUBLE', 'TEXT'];
  const dataTypeEncodingMap = {'BOOLEAN':['PLAIN', 'RLE'], 'INT32':['PLAIN', 'RLE', 'TS_2DIFF', 'GORILLA'],
    'INT64':['PLAIN', 'RLE', 'TS_2DIFF', 'GORILLA'], 'FLOAT':['PLAIN', 'RLE', 'TS_2DIFF', 'GORILLA'],
    'DOUBLE':['PLAIN', 'RLE', 'TS_2DIFF', 'GORILLA'], 'TEXT':['PLAIN']};
  const { Option } = Select;
  const [form, form2] = Form.useForm();
  const [selectedGranularity, setSelectedGranularity] = React.useState(undefined);
  const [selectedSg, setSelectedSg] = React.useState(undefined);
  const [entities, setEntities] = React.useState(undefined);
  const [selectedEntity, setSelectedEntity] = React.useState(undefined);
  const [physical, setPhysical] = React.useState(undefined);
  const [selectedPhysical, setSelectedPhysical] = React.useState(undefined);
  const [addAuth, setAddAuth] = React.useState(undefined);
  const [dataType2, setDataType2] = React.useState(undefined);
  const handleProvinceChange = value => {
    setSelectedSg(value);
    setEntities(currentSchema[1][value]);
    setSelectedEntity([]);
    setPhysical([])
    setSelectedPhysical([]);
    setAddAuth([]);
  };

  const onGranularityChange = value => {
    setSelectedSg([]);
    setEntities(currentSchema[1][value]);
    setSelectedEntity([]);
    setPhysical([])
    setSelectedPhysical([]);
    setSelectedGranularity(value);
  };

  const onEntityChange = value => {
    setSelectedEntity(value);
    setPhysical(currentSchema[2][value]);
    setSelectedPhysical([]);
  };

  const onPhysicalChange = value => {
    setSelectedPhysical(value);
  };

  const addTimeseries = async(text,record,form) => {
    try {
      await form.validateFields();
      const entity = form.getFieldValue('granularity2');
      let path = currentValue + '.' + (entity == null?'':entity + '.') + form.getFieldValue('physical2');
      let ret = await addTimeseriesWithTenantUsingPOST({path:path, dataType:form.getFieldValue('dataType2'),
        encoding:form.getFieldValue('encoding2')});
      if(ret.code == '0'){
        refresh();
      }else{
        notification.error({
          message: ret.message,
        });
      }
    } catch (e) {
    }
  }

  const columns = [
    {
      title: intl.formatMessage({id: 'manageUser.privilege.granularity.entity',}),
      dataIndex: 'granularity',
      key: 'granularity',
      render: text => (
        <>
          {currentValue + '.' + text}
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'manageUser.privilege.granularity.physical',}),
      dataIndex: 'range',
      key: 'range',
      render: text => (
        <>
          <div style={{ marginBottom: -10 }}>
          {text.toString().trim().split(",").map(item=>{
            return (<p key={item}>{item}</p>);
          })}
          </div>
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'createStorageGroup.timeseries.dataType',}),
      dataIndex: 'dataType',
      key: 'dataType',
      render: text => (
        <>
          <Tag> {text} </Tag>
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'createStorageGroup.timeseries.codeMode',}),
      dataIndex: 'encoding',
      key: 'encoding',
      render: text => (
        <>
          <Tag> {text} </Tag>
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'query.sql.export.compressionMode',}),
      dataIndex: 'compression',
      key: 'compression',
      render: text => (
        <>
          <Tag> {text} </Tag>
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'pages.operation.text',}),
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm placement="left" title={currentValue + '.' + record.granularity + '.' +
            record.range + " -- " + intl.formatMessage({id: 'pages.delete.confirm',})}
            onConfirm={(e) => onDeleteItem(record,e)} >
            <a>{intl.formatMessage({id: 'pages.delete.text',})}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const columns2 = [
    {
      title: intl.formatMessage({id: 'manageUser.privilege.granularity.entity',}),
      dataIndex: 'granularity2',
      key: 'granularity2',
      render: text => (
        <>
        <ProFormText
          name="granularity2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'createStorageGroup.entity.description',}),
            },
            {
              message: 'Between 1 to 1000 character',
              max: 1000,
            },
            {
              pattern: /^(?!\.)[a-zA-Z0-9.\u4e00-\u9fa5_]+$/,
              message: intl.formatMessage({id: 'createStorageGroup.entity.rule',}),
            },
          ]}
          fieldProps={{
            // style:{ width: 150 }
          }}
          placeholder={intl.formatMessage({id: 'createStorageGroup.entity.description',})}
        />
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'manageUser.privilege.granularity.physical',}),
      dataIndex: 'physical2',
      key: 'physical2',
      render: text => (
        <>
        <ProFormText
          name="physical2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'createStorageGroup.physical.description',}),
            },
            {
              pattern: /^(?!_)[a-zA-Z0-9\u4e00-\u9fa5_]+$/,
              message: intl.formatMessage({id: 'createStorageGroup.physical.rule',}),
            },
          ]}
          fieldProps={{
            // style:{ width: 150 }
          }}
          placeholder={intl.formatMessage({id: 'createStorageGroup.physical.description',})}
        />
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'createStorageGroup.timeseries.dataType',}),
      dataIndex: 'dataType2',
      key: 'dataType2',
      render: text => (
        <ProFormSelect
          name="dataType2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'createStorageGroup.dataType.description',}),
            },
          ]}
          options={dataTypeArray}
          fieldProps={{
            onChange:(val) => {
              setDataType2(val);
              form.setFieldsValue({encoding2:null})
            }
            // style:{ width: 100 }
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({id: 'createStorageGroup.timeseries.codeMode',}),
      dataIndex: 'encoding2',
      key: 'encoding2',
      render: text => (
        <ProFormSelect
          name="encoding2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'createStorageGroup.codeMode.description',}),
            },
          ]}
          options={dataType2==null?[]:dataTypeEncodingMap[dataType2]}
          fieldProps={{
            // style:{ width: 100 }
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({id: 'pages.operation.text',}),
      key: 'action2',
      render: (text, record2) => (
        <Space size="middle" style={{ marginBottom: 25 }}>
          {(
            <a onClick={(e) => {
              addTimeseries(text,record2,form);
          }}>{intl.formatMessage({id: 'pages.save.text',})}</a>)}
          </Space>
      ),
    },
  ];
  if (!visible) {
    return null;
  }
  return (
    <ModalForm
      visible={visible}
      form={form}
      title={intl.formatMessage({id: 'createStorageGroup.timeseries.detail',}) +
        ' -- ' + currentValue}
      className={styles.standardListForm}
      initialValues={current}
      submitter={{
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
        render: (props, defaultDoms) => {
          return [
            <Button
              key="add"
              onClick={() => {
                setSelectedGranularity(null);
                setSelectedSg([]);
                setEntities([]);
                setSelectedEntity([]);
                setPhysical([])
                setSelectedPhysical([]);
                setAddAuth([]);
                setCreateable(!createable);
              }}
            >
              {createable?intl.formatMessage({id: 'pages.cancelAdd.text',}):
                intl.formatMessage({id: 'pages.add.text',})}
            </Button>,
            ...defaultDoms,
          ];
        },

      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done
          ? {
              padding: '72px 0',
            }
          : {},
      }}
    >
      <div style={{textAlign: 'right', marginBottom: '10px', marginTop: '-10px'}}>
      <Button.Group>
        <Button value="all" onClick={() => {
          setSearchContent(null);
          searchTimeseries(currentValue,null);
        }}><ReloadOutlined />{intl.formatMessage({id: 'pages.refresh.text',})}</Button>
        <Input.Search
          style={{width: '220px'}}
          placeholder={intl.formatMessage({id: 'createStorageGroup.timeseries.search.description',})}
           onSearch={(filter) => {
              searchTimeseries(currentValue,filter);
          }} onChange={(e) => {
            setSearchContent(e.target.value);
          }}
          value={searchContent}
          suffix={
              (searchContent==null||searchContent=='')?
              <CloseCircleFilled style={{ display: 'none' }} />:
              <CloseCircleFilled style={{ color: 'rgba(0,0,0,.45)' }} onClick={() => {setSearchContent(null)}}/>
          }
        />
      </Button.Group>
      </div>
      <Table columns={columns} dataSource={current} pagination={{pageSize:10, showQuickJumper:true,}}/>
      {createable==true?(
        <Table columns={columns2} dataSource={[{key:null,granularity2:null,auth2:null}]} pagination={{hideOnSinglePage:true}} />
      ):null}
    </ModalForm>
  );
};

export default OperationModal;
