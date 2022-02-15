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
import { addPrivilegesWithTenantUsingPOST } from '@/services/swagger1/iotDbController';
const OperationModal = (props) => {
  const intl = useIntl();
  const { done, visible, current, onDone, children, editable, setEditable, changeState, createable, setCreateable,
    onSaveAuth, onDeleteAuth, refresh, currentSchema, currentUser } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const authConnectionOptions = ['SET_STORAGE_GROUP','INSERT_TIMESERIES','READ_TIMESERIES','CREATE_TIMESERIES',
'DELETE_TIMESERIES','CREATE_USER','DELETE_USER','MODIFY_PASSWORD','LIST_USER','GRANT_USER_PRIVILEGE',
'REVOKE_USER_PRIVILEGE','CREATE_FUNCTION','DROP_FUNCTION','CREATE_TRIGGER','DROP_TRIGGER','START_TRIGGER','STOP_TRIGGER'];
  const authMeasureOptions = ['INSERT_TIMESERIES','READ_TIMESERIES','CREATE_TIMESERIES','DELETE_TIMESERIES'];
  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedGranularity, setSelectedGranularity] = React.useState(undefined);
  const [selectedSg, setSelectedSg] = React.useState(undefined);
  const [entities, setEntities] = React.useState(undefined);
  const [selectedEntity, setSelectedEntity] = React.useState(undefined);
  const [physical, setPhysical] = React.useState(undefined);
  const [selectedPhysical, setSelectedPhysical] = React.useState(undefined);
  const [addAuth, setAddAuth] = React.useState(undefined);
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

  const addPrivileges = async(text,record,form) => {
    try {
      await form.validateFields();
      let range = 'root';
      let ret = await addPrivilegesWithTenantUsingPOST({user:currentUser, auth:addAuth,
        sg:selectedSg, entity:selectedEntity, physical:selectedPhysical});
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
                record.granularity == '数据连接'?authConnectionOptions:authMeasureOptions
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
              changeState(text, editable, setEditable)
          }}>{intl.formatMessage({id: 'pages.edit.text',})}</a>)}

          {editable[record.key]==true?(
            <a onClick={(e) => {
              changeState(text, editable, setEditable)
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
              label: intl.formatMessage({id: 'manageUser.privilege.granularity.storageGroup',}),
              value: 'storage',
            },
            {
              label: intl.formatMessage({id: 'manageUser.privilege.granularity.entity',}),
              value: 'entity',
            },
            {
              label: intl.formatMessage({id: 'manageUser.privilege.granularity.physical',}),
              value: 'physical',
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
      render: text => selectedGranularity=='physical'?(
        <>
          <ProFormSelect options={currentSchema[0]}
          name="sg2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id:
                'manageUser.privilege.granularity.storageGroup.required',}),
            },
          ]}
          fieldProps={{onChange:(val) => handleProvinceChange(val),
            defaultValue:null,value:selectedSg,
            style:{ width: 150 }
          }}  />
          <ProFormSelect options={entities}
          name="entity2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id:
                'manageUser.privilege.granularity.entity.required',}),
            },
          ]}
          fieldProps={{onChange:(val) => {onEntityChange(val)},
            value:selectedEntity,
            style:{ width: 150 }
          }} />
          <ProFormSelect options={physical} mode="multiple"
          name="physical2"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id:
                'manageUser.privilege.granularity.physical.required',}),
            },
          ]}
          fieldProps={{onChange:(val) => {onPhysicalChange(val)},
            value:selectedPhysical,
            style:{ width: 150 }
          }} />
        </>
      ):selectedGranularity=='entity'?(
        <>
          <ProFormSelect options={currentSchema[0]}
          name="sg3"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id:
                'manageUser.privilege.granularity.storageGroup.required',}),
            },
          ]}
          fieldProps={{onChange:(val) => handleProvinceChange(val),
            defaultValue:null,value:selectedSg,
            style:{ width: 150 }
          }}  />
          <ProFormSelect options={entities} mode="multiple"
          name="entity3"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id:
                'manageUser.privilege.granularity.entity.required',}),
            },
          ]}
          fieldProps={{onChange:(val) => {onEntityChange(val)},
            value:selectedEntity,
            style:{ width: 150 }
          }} />
        </>
      ):selectedGranularity=='storage'?(
        <>
          <ProFormSelect options={currentSchema[0]} mode="multiple"
          name="sg4"
          rules={[
            {
              required: true,
              message: intl.formatMessage({id:
                'manageUser.privilege.granularity.storageGroup.required',}),
            },
          ]}
          fieldProps={{onChange:(val) => handleProvinceChange(val),
            value:selectedSg,
            style:{ width: 150 }
          }}  />
        </>
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
      <Table columns={columns} dataSource={current} pagination={{pageSize:10}}/>
      {createable==true?(
        <Table columns={columns2} dataSource={[{key:null,granularity2:null,auth2:null}]} pagination={{hideOnSinglePage:true}} />
      ):null}
    </ModalForm>
  );
};

export default OperationModal;
