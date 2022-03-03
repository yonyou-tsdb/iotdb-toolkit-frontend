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
import { Button, Result, Table, Tag, Space, Checkbox, Popover, Modal, Popconfirm, Select, Form,
  notification, Input } from 'antd';
import { ReloadOutlined, CloseCircleFilled } from '@ant-design/icons';
import { useRequest, useModel, useIntl } from 'umi';
import { addPrivilegesWithTenantUsingPOST } from '@/services/swagger1/iotDbController';
const { Search } = Input;
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, current, onDone, children, editable, setEditable, changeState,
    createable, setCreateable, onSaveAuth, onDeleteAuth, currentUser, tosave,
    unsave, pagePrivilegesShowTotal, pagePrivilegesHasMore, pagePrivilegesAppend,
    currentFiltered, setCurrentFiltered, refresh, search, searchContent, setSearchContent,
    onAddDone, } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const authConnectionOptions = ['SET_STORAGE_GROUP','INSERT_TIMESERIES','READ_TIMESERIES','CREATE_TIMESERIES',
'DELETE_TIMESERIES','CREATE_USER','DELETE_USER','MODIFY_PASSWORD','LIST_USER','GRANT_USER_PRIVILEGE',
'REVOKE_USER_PRIVILEGE','CREATE_FUNCTION','DROP_FUNCTION','CREATE_TRIGGER','DROP_TRIGGER','START_TRIGGER','STOP_TRIGGER'];
  const authMeasureOptions = ['INSERT_TIMESERIES','READ_TIMESERIES','CREATE_TIMESERIES','DELETE_TIMESERIES'];
  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedGranularity, setSelectedGranularity] = React.useState(undefined);
  const [timeseries, setTimeseries] = React.useState(undefined);
  const [addAuth, setAddAuth] = React.useState(undefined);

  const onGranularityChange = value => {
    setTimeseries(null);
    setAddAuth(null);
    setSelectedGranularity(value);
  };

  const addPrivileges = async(text,record,form) => {
    try {
      await form.validateFields();
      let range = 'root';
      let ret = await addPrivilegesWithTenantUsingPOST({user:currentUser, auth:addAuth,
        timeseries:timeseries});
      if(ret.code == '0'){
        let messageJson = JSON.parse(ret.message || '{}');
        onAddDone(messageJson);
        notification.success({
          message: messageJson.range + ' add "' + messageJson.success + '" success',
        });
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
      title: intl.formatMessage({id: 'manageUser.privilege.level',}),
      dataIndex: 'depth',
      key: 'depth',
      render: text => (
        <>
          {text}
        </>
      ),
    },
    {
      title: intl.formatMessage({id: 'manageUser.privilege.range',}),
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
      title: intl.formatMessage({id: 'manageUser.privilege.auth',}),
      key: 'auth',
      dataIndex: 'auth',
      render: (tags, record) => {
        return editable[record.key]==true ? (
          <>
            <Checkbox.Group defaultValue={tags} options={
                record.range == 'root'?authConnectionOptions:authMeasureOptions
              } onChange={(e)=>{record.auth=e;}}/>
          </>
          ) : (
          <>
            {tags.map(tag => {
              return (
                <Tag key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </>
          )
      }
    },
    {
      title: intl.formatMessage({id: 'pages.operation.text',}),
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {editable[record.key]==true?(
            <a onClick={(e) => {
              onSaveAuth(record,e)
          }}>{intl.formatMessage({id: 'pages.save.text',})}</a>):(
            <a onClick={(e) => {
              tosave(text, editable, setEditable)
          }}>{intl.formatMessage({id: 'pages.edit.text',})}</a>)}

          {editable[record.key]==true?(
            <a onClick={(e) => {
              unsave(text, editable, setEditable)
            }}>{intl.formatMessage({id: 'pages.cancel.text',})}</a>
          ):(<Popconfirm placement="left" title={record.range + " -- "
               + intl.formatMessage({id: 'manageUser.privilege.delete.confirm',})}
            onConfirm={(e) => onDeleteAuth(record,e)}>
              <a>{intl.formatMessage({id: 'pages.delete.text',})}</a>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];
  const columns2 = [
    {
      title: intl.formatMessage({id: 'manageUser.privilege.granularity',}),
      dataIndex: 'granularity2',
      key: 'granularity2',
      render: (text, record2) => (
        <ProFormSelect
          name="granularity2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'pages.required.text',}),
            },
          ]}
          options={[
            {
              label: intl.formatMessage({id: 'manageUser.privilege.granularity.connection',}),
              value: 'connection',
            },
            {
              label: intl.formatMessage({id: 'manageUser.privilege.granularity.timeseries',}),
              value: 'timeseries',
            },
          ]}
          fieldProps={{onChange:(val) => {onGranularityChange(val);record2.granularity2=val;},
            value:selectedGranularity,style:{ width: 100 }
          }}
          placeholder={intl.formatMessage({id: 'pages.choose.placeholder',})}
        />
      ),
    },
    {
      title: intl.formatMessage({id: 'manageUser.privilege.range',}),
      dataIndex: 'range2',
      key: 'range2',
      render: (text, record2) => selectedGranularity=='timeseries'?(
        <ProFormText
          name="range2"
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
          onChange={(e)=>{setTimeseries(e.target.value);}}
          fieldProps={{
            value: timeseries,
            addonBefore: 'root.',
            style:{ width: 300 },
          }}
        />
      ):null
    },
    {
      title: intl.formatMessage({id: 'manageUser.privilege.auth',}),
      key: 'auth2',
      dataIndex: 'auth2',
      render: (tags, record2) => {
        return  (
          <div style={{ }}>
          {
            selectedGranularity==null?null:(selectedGranularity=='connection'?(
            <ProFormCheckbox.Group defaultValue={tags} options={authConnectionOptions}
            onChange={(e)=>{record2.auth2=e;setAddAuth(e);}}
            fieldProps={{
              value:addAuth,
            }}
            name="auth2"
            rules={[
              {
                  required: true,
                  message: intl.formatMessage({id: 'manageUser.privilege.auth.required',}),
                  type: 'array',
              },
            ]}
            />):(
              <ProFormCheckbox.Group defaultValue={tags} options={authMeasureOptions}
              onChange={(e)=>{record2.auth2=e;setAddAuth(e);}}
              fieldProps={{
                value:addAuth,
              }}
              name="auth3"
              rules={[
                {
                    required: true,
                    message: intl.formatMessage({id: 'manageUser.privilege.auth.required',}),
                    type: 'array',
                },
              ]}
              />
            ))}
          </div>
        )
      }
    },
    {
      title: intl.formatMessage({id: 'pages.operation.text',}),
      key: 'action2',
      render: (text, record2) => (
        <Space size="middle">
          {(
            <a onClick={(e) => {
              addPrivileges(text,record2,form);
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
      title={intl.formatMessage({id: 'manageUser.privilege.detail',}) + ' -- ' + currentUser }
      className={styles.standardListForm}
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
                setTimeseries(null);
                setAddAuth([]);
                setCreateable(!createable);
              }}
            >
              {createable?intl.formatMessage({id: 'pages.cancelAdd.text',})
                :intl.formatMessage({id: 'pages.add.text',})}
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
          refresh();
        }}><ReloadOutlined />{intl.formatMessage({id: 'pages.refresh.text',})}</Button>
        <Search className={styles.extraContentSearch} placeholder=
          {intl.formatMessage({id: 'pages.refresh.placeholder',})} onSearch={(value) => {
          search(value);
        }} onChange={(e) => {setSearchContent(e.target.value);}}
          value={searchContent}
          suffix={
              (searchContent==null||searchContent=='')?
              <CloseCircleFilled style={{ display: 'none' }} />:
              <CloseCircleFilled style={{ color: 'rgba(0,0,0,.45)' }} onClick={() => {setSearchContent(null)}}/>
          }
        />
      </Button.Group>
    </div>
      <Table columns={columns} dataSource={currentFiltered} pagination={{
        pageSize: 10,
        showQuickJumper: true,
        showTotal: pagePrivilegesShowTotal,
      }}/>
      {createable==true?(
        <Table columns={columns2} dataSource={[{key:null,granularity2:null,auth2:null}]} pagination={{hideOnSinglePage:true}} />
      ):null}
    </ModalForm>
  );
};

export default OperationModal;
