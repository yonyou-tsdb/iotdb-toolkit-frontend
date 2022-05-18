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
import { queryAllUsingPOST, deleteThenReturnAllUsingPOST } from '@/services/swagger1/queryController';
import moment from 'moment';
import CommonUtil from '../../../../utils/CommonUtil';
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, content, setContent, querySql, activeQueryTabkey, setQuerySql, setVisible, } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const [searchContent, setSearchContent] = useState(undefined);
  const { Option } = Select;
  const [form] = Form.useForm();
  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(async() => {
  });
  const change = async (current, pageSize, nameLike)=>{
    let ret = await queryAllUsingPOST({
      pageSize: 10,
      pageNum: current,
      nameLike: nameLike,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    CommonUtil.dealCallback(ret, (_ret)=>{
      let index = 0;
      _ret.data.pageItems.map((item)=>{item['key']=index++;});
      setContent(_ret.data);
    }, notification);
  }
  const onDeleteItem = async (record)=>{
    let ret = await deleteThenReturnAllUsingPOST({
      queryId: record.id,
      pageSize: 10,
      pageNum: 1,
      nameLike: searchContent,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    CommonUtil.dealCallback(ret, (_ret)=>{
      let index = 0;
      _ret.data.pageItems.map((item)=>{item['key']=index++;});
      setContent(_ret.data);
    }, notification);
  }
  const columns = [
    {
      title: intl.formatMessage({id: 'query.sql.script.name',}),
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: text => (
        <div>{text}</div>
      ),
    },
    {
      title: 'SQL',
      dataIndex: 'sqls',
      key: 'sqls',
      width: '45%',
      render: text => (
        <div>{text}</div>
      ),
    },
    {
      title: intl.formatMessage({id: 'query.sql.script.createTime',}),
      dataIndex: 'createTime',
      key: 'createTime',
      width: '20%',
      render: text => (
        <>
          {moment(parseInt(text)).format('YYYY-MM-DD HH:mm')}
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'pages.operation.text',}),
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={(e) => {
            querySql[activeQueryTabkey]=record.sqls;
            setQuerySql({...querySql});
            setVisible(false);
          }}>{intl.formatMessage({id: 'pages.use.text',})}</a>
          <Popconfirm placement="left" title={
              record.name + " -- " + intl.formatMessage({id: 'pages.delete.confirm',})
            }
            onConfirm={(e) => onDeleteItem(record,e)}>
            <a>{intl.formatMessage({id: 'pages.delete.text',})}</a>
          </Popconfirm>
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
      title={intl.formatMessage({id: 'query.sql.script.view',})}
      className={styles.standardListForm}
      initialValues={content.pageItems}
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
        onCancel: () => setVisible(false),
        destroyOnClose: true,
        bodyStyle: done
          ? {
              padding: '72px 0',
            }
          : {},
      }}
    >
      <>
      <div style={{textAlign: 'right', marginBottom: '10px', marginTop: '-10px'}}>
      <Button.Group>
        <Button value="all" onClick={() => {
          setSearchContent(null);
          change(1, 10);
        }}><ReloadOutlined />{intl.formatMessage({id: 'pages.refresh.text',})}</Button>
        <Search
          style={{width: '190px'}}
          placeholder={intl.formatMessage({id: 'pages.refresh.placeholder',})}
           onSearch={(value) => {
          change(1, 10, value);
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
      <Table columns={columns} dataSource={content.pageItems} pagination={{
        showSizeChanger: false,
        showQuickJumper: true,
        pageSize:10,
        current: content==null?1:content.pageNo,
        total: content==null?1:content.totalCount,
        onChange:(current, pageSize)=>{
          change(current, pageSize, searchContent);
        },
      }}/>
      </>
    </ModalForm>
  );
};

export default OperationModal;
