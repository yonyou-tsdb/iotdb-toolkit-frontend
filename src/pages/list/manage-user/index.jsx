import React, { useState } from 'react';
import { DownOutlined, PlusOutlined, DatabaseOutlined, TeamOutlined, ReloadOutlined, UsergroupAddOutlined,
  CloseCircleFilled} from '@ant-design/icons';
import {Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Progress, Radio, Row, notification, Popconfirm,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useModel, useIntl } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import AddUserModal from './components/AddUserModal';
import EditUserModal from './components/EditUserModal';
import { addFakeList, queryFakeList, removeFakeList, updateFakeList } from './service';
import { listUserWithTenantUsingPOST, listPrivilegesWithTenantUsingPOST, changePrivilegesWithTenantUsingPOST,
  showSchemaWithTenantUsingPOST, deleteUserWithTenantUsingPOST,
 } from '@/services/swagger1/iotDbController';
import styles from './style.less';
const RadioButton = Radio.Button;
const { Search } = Input;

const ListContent = ({ data: { createTime, username } }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <p>用户名</p>
      <p>{username}</p>
    </div>
    <div className={styles.listContentItem2}>
      <p>创建时间</p>
      <p>{moment(parseInt(createTime)).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
);

export const BasicList = () => {
  const intl = useIntl();
  const [done, setDone] = useState(false);
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [editUserVisible, setEditUserVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);
  const [currentSchema, setCurrentSchema] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [doneResultStatus, setDoneResultStatus] = useState(undefined);
  const [doneResultTitle, setDoneResultTitle] = useState(undefined);
  const [editable, setEditable] = useState({});
  const [editUser, setEditUser] = useState(undefined);
  const [createable, setCreateable] = useState(false);
  const [searchContent, setSearchContent] = useState(undefined);
  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(async() => {
    initUser();
  });
  let totalCount = listData?.length || 1;
  let paginationProps = {
    showQuickJumper: true,
    pageSize: 10,
    current: initialState.manageUser_self_current===undefined?1:initialState.manageUser_self_current,
    total: initialState.manageUser_self_totalCount===undefined?totalCount:initialState.manageUser_self_totalCount,
    onChange:(current, pageSize)=>{
      setInitialState({ ...initialState, manageUser_self_current: current,
       });
    },
  };
  const initUser = async(filter) => {
    let ret = await listUserWithTenantUsingPOST();
    if(ret.code == '0'){
      if(filter != null && filter != ''){
        ret.data = ret.data.filter(array => array.user.match(filter));
      }
      setInitialState({ ...initialState, manageUser_self: ret.data,
        manageUser_self_totalCount: ret.data.length, manageUser_self_current: 1, });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }
  const change = async (filter)=>{
    const ret = await listUserWithTenantUsingPOST();
    if(ret.code == '0'){
      if(filter != null && filter != ''){
        ret.data = ret.data.filter(array => array.user.match(filter));
      }
      setInitialState({ ...initialState, manageUser_self: ret.data,
        manageUser_self_totalCount: ret.data.length,
        manageUser_self_current: 1,
      });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }

  const showEditModal = async (e,item) => {
    e.preventDefault();
    let ret = await listPrivilegesWithTenantUsingPOST({user:item.user});
    let ret2 = await showSchemaWithTenantUsingPOST();
    if(ret.code=='0' && ret2.code=='0'){
      setCurrentSchema(ret2.data);
      setCurrentItem(ret.data);
      setCurrentUser(item.user);
      setVisible(true);
    }else{
      notification.error({
        message: ret.message,
      });
    }
  };

  const showAddUserModal = (e) => {
    e.preventDefault();
    setAddUserVisible(true);
  }

  const changeState = (text, editable, setEditable) => {
    if(editable[text.key]==null||editable[text.key]==false){
      editable[text.key]=true;
      setEditable({...editable});
    }else{
      editable[text.key]=false;
      setEditable(editable);
      setEditable({...editable});
    }
  }

  const deleteUser = async (item) => {
    const ret = await deleteUserWithTenantUsingPOST({user:item.user});
    if(ret.code == '0'){
      initUser(searchContent);
      notification.success({
        message: 'Delete User ' + item.user + ' Success',
      });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }

  const extraContent = (
    <Button.Group>
        <Button value="all" onClick={() => {
          setSearchContent(null);
          change();
        }}><ReloadOutlined />{intl.formatMessage({id: 'pages.refresh.text',})}</Button>
        <Search className={styles.extraContentSearch} placeholder=
        {intl.formatMessage({id: 'pages.refresh.placeholder',})} onSearch={(value) => {
          change(value);
        }} onChange={(e) => {setSearchContent(e.target.value);}}
          value={searchContent}
          suffix={
              (searchContent==null||searchContent=='')?
              <CloseCircleFilled style={{ display: 'none' }} />:
              <CloseCircleFilled style={{ color: 'rgba(0,0,0,.45)' }} onClick={() => {setSearchContent(null)}}/>
          }
        />
    </Button.Group>
  );

  const MoreBtn = ({ item }) => (
    <Dropdown
      trigger={['click']}
      overlay={
        <Menu>
          <Menu.Item key="edit" onClick={()=>{setEditUser(item);setEditUserVisible(true);}}>
            {intl.formatMessage({id: 'pages.edit.text',})}
          </Menu.Item>
          <Popconfirm placement="left" overlayStyle={{paddingRight:20}} title={
            item.user + " -- " + intl.formatMessage({id: 'pages.delete.confirm',})
          }
           onConfirm={(e) => {deleteUser(item);}} okText="是" cancelText="否">
            <Menu.Item key="delete">
              {intl.formatMessage({id: 'pages.delete.text',})}
            </Menu.Item>
          </Popconfirm>
        </Menu>
      }
    >
      <a>
        {intl.formatMessage({id: 'pages.more.text',})} <DownOutlined />
      </a>
    </Dropdown>
  );

  const handleDone = () => {
    if(doneResultStatus==='success'){
      change(searchContent);
    }
    setDone(false);
    setVisible(false);
    setCurrentItem({});
    setCurrentUser(null);
    setEditable({});
    setCreateable(false);
  };

  const handleDeleteAuth = async(record) => {
    const ret = await changePrivilegesWithTenantUsingPOST({user:currentUser, range: record.range})
    if(ret.code == '0'){
      refresh();
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }

  const handleSaveAuth = async(record,e) => {
    const ret = await changePrivilegesWithTenantUsingPOST({user:currentUser, auth:record.auth, range: record.range})
    if(ret.code == '0'){
      refresh();
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }

  const refresh = async() => {
    let ret = await listPrivilegesWithTenantUsingPOST({user:currentUser});
    let ret2 = await showSchemaWithTenantUsingPOST();
    setCurrentItem(ret.data);
    setCurrentUser(currentUser);
    setEditable({});
  }

  return (
    <div>
      <PageContainer title={initialState.activeConnectionDesc}>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title={null}
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={initialState.manageUser_self}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {showEditModal(e, item)}}
                    >
                      {intl.formatMessage({id: 'manageUser.privilege.detail',})}
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#FC4C2F' }} icon={<TeamOutlined />} shape="square" size="large" />}
                    title={item.user}
                    description={null}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
      <Button
        type="dashed"
        onClick={(e) => {showAddUserModal(e, {})}}
        style={{
          width: '100%',
          marginBottom: 8,
        }}
      >
        <UsergroupAddOutlined />
        {intl.formatMessage({id: 'manageUser.create.title',})}
      </Button>
      <OperationModal
        done={done}
        doneResultStatus={doneResultStatus}
        doneResultTitle={doneResultTitle}
        visible={visible}
        current={currentItem}
        currentSchema={currentSchema}
        currentUser={currentUser}
        onDone={handleDone}
        onSaveAuth={handleSaveAuth}
        onDeleteAuth={handleDeleteAuth}
        refresh={refresh}
        editable={editable}
        setEditable={setEditable}
        createable={createable}
        setCreateable={setCreateable}
        changeState={changeState}
      />
      <AddUserModal
        addUserVisible={addUserVisible}
        setAddUserVisible={setAddUserVisible}
        initUser={initUser}
        searchContent={searchContent}
      />
      <EditUserModal
        editUserVisible={editUserVisible}
        setEditUserVisible={setEditUserVisible}
        editUser={editUser}
      />
    </div>
  );
};
export default BasicList;
