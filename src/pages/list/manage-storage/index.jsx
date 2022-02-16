import React, { useState } from 'react';
import { DownOutlined, PlusOutlined, DatabaseOutlined, TeamOutlined, ReloadOutlined, FolderAddOutlined,
  FolderOutlined, CloseCircleFilled } from '@ant-design/icons';
import {Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Progress, Radio, Row, notification, Popconfirm,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useModel, useIntl } from 'umi';
import moment from 'moment';
import DateUtil from '../../../utils/DateUtil';
import OperationModal from './components/OperationModal';
import AddModal from './components/AddStorageModal';
import EditStorageModal from './components/EditStorageModal';
import { showTimeseriesWithTenantUsingPOST, changePrivilegesWithTenantUsingPOST,
  showSchemaWithTenantUsingPOST, showStorageWithTenantUsingPOST,
  deleteStorageGroupWithTenantUsingPOST, deleteTimeseriesWithTenantUsingPOST,
 } from '@/services/swagger1/iotDbController';
import styles from './style.less';
const RadioButton = Radio.Button;
const { Search } = Input;

export const BasicList = () => {
  const intl = useIntl();
  const [done, setDone] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);
  const [currentSchema, setCurrentSchema] = useState(undefined);
  const [currentValue, setCurrentValue] = useState(undefined);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [doneResultStatus, setDoneResultStatus] = useState(undefined);
  const [doneResultTitle, setDoneResultTitle] = useState(undefined);
  const [editable, setEditable] = useState({});
  const [editItem, setEditItem] = useState(undefined);
  const [createable, setCreateable] = useState(false);
  const [searchContent, setSearchContent] = useState(undefined);
  const [searchTimeseriesContent, setSearchTimeseriesContent] = useState(undefined);
  const { getStringFromMillisecond } = DateUtil;
  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(async() => {
    initItem();
  });
  const ListContent = ({ data: { timeseriesCount } }) => (
    <div className={styles.listContent}>
      <div className={styles.listContentItem2}>
        <p>{intl.formatMessage({id: 'createStorageGroup.timeseries.count',})} {timeseriesCount}</p>
      </div>
    </div>
  );
  let totalCount = listData?.length || 1;
  let paginationProps = {
    showQuickJumper: true,
    pageSize: 10,
    current: initialState.manageStorage_self_current===undefined?1:initialState.manageStorage_self_current,
    total: initialState.manageStorage_self_totalCount===undefined?totalCount:initialState.manageStorage_self_totalCount,
    onChange:(current, pageSize)=>{
      setInitialState({ ...initialState, manageStorage_self_current: current,
       });
    },
  };
  const initItem = async(filter) => {
    let ret = await showStorageWithTenantUsingPOST();
    if(ret.code == '0'){
      if(filter != null && filter != ''){
        ret.data = ret.data.filter(array => array.timeseries.match(filter));
      }
      setInitialState({ ...initialState, manageStorage_self: ret.data,
        manageStorage_self_totalCount: ret.data.length, manageStorage_self_current: 1, });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }
  const change = async (filter)=>{
    const ret = await showStorageWithTenantUsingPOST();
    if(ret.code == '0'){
      if(filter != null && filter != ''){
        ret.data = ret.data.filter(array => array.timeseries.match(filter));
      }
      setInitialState({ ...initialState, manageStorage_self: ret.data,
        manageStorage_self_totalCount: ret.data.length,
        manageStorage_self_current: 1,
      });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }

  const showEditModal = async (e,item) => {
    e.preventDefault();
    setSearchTimeseriesContent(null);
    let ret = await showTimeseriesWithTenantUsingPOST({path:item.value});
    let ret2 = await showSchemaWithTenantUsingPOST();
    if(ret.code=='0' && ret2.code=='0'){
      setCurrentSchema(ret2.data);
      setCurrentItem(ret.data);
      setCurrentValue(item.value);
      setVisible(true);
    }else{
      notification.error({
        message: ret.message,
      });
    }
  };

  const searchTimeseries = async (currentValue, filter) => {
    let ret = await showTimeseriesWithTenantUsingPOST({path:currentValue});
    let temp = ret.data;
    if(filter != null && filter != ''){
      temp =  temp.filter(item => item.timeseries.match(filter));
    }
    setCurrentItem(temp);
  }

  const showAddModal = (e) => {
    e.preventDefault();
    setAddModalVisible(true);
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

  const deleteItem = async (item) => {
    const ret = await deleteStorageGroupWithTenantUsingPOST({name:item.value});
    if(ret.code == '0'){
      initItem(searchContent);
      notification.success({
        message: 'Delete Storage Group ' + item.value + ' Success',
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
          <Menu.Item key="edit" onClick={()=>{setEditItem(item);setEditModalVisible(true);}}>
            {intl.formatMessage({id: 'createStorageGroup.ttl.edit',})}
          </Menu.Item>
          <Popconfirm placement="left" overlayStyle={{paddingRight:20}} title={
            item.value + " -- " + intl.formatMessage({id: 'pages.delete.confirm',})
          }
           onConfirm={(e) => {deleteItem(item);}}>
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
    setCurrentValue(null);
    setEditable({});
    setCreateable(false);
  };

  const handleDeleteItem = async(record) => {
    const ret = await deleteTimeseriesWithTenantUsingPOST({path:record.timeseries})
    if(ret.code == '0'){
      notification.success({
        message: 'Delete timeseries ' + record.timeseries + ' success',
      });
      refresh();
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }

  const refresh = async() => {
    let ret = await showTimeseriesWithTenantUsingPOST({path:currentValue});
    let ret2 = await showSchemaWithTenantUsingPOST();
    let temp = ret.data;
    if(searchTimeseriesContent != null && searchTimeseriesContent != ''){
      temp =  temp.filter(item => item.timeseries.match(searchTimeseriesContent));
    }
    setCurrentItem(temp);
    setCurrentValue(currentValue);
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
              dataSource={initialState.manageStorage_self}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {showEditModal(e, item)}}
                    >
                      {intl.formatMessage({id: 'createStorageGroup.timeseries.detail',})}
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#FC4C2F' }} icon={<FolderOutlined />} shape="square" size="large" />}
                    title={item.value}
                    description={(item.ttl==null?'':intl.formatMessage({id: 'createStorageGroup.ttl.text',})
                     + ' ' + getStringFromMillisecond(item.ttl)) }
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
      <Button
        type="dashed"
        onClick={(e) => {showAddModal(e, {})}}
        style={{
          width: '100%',
          marginBottom: 8,
        }}
      >
        <FolderAddOutlined />
        {intl.formatMessage({id: 'createStorageGroup.storageGroup.create',})}
      </Button>
      <OperationModal
        done={done}
        doneResultStatus={doneResultStatus}
        doneResultTitle={doneResultTitle}
        visible={visible}
        current={currentItem}
        setCurrent={setCurrentItem}
        currentSchema={currentSchema}
        currentValue={currentValue}
        onDone={handleDone}
        onDeleteItem={handleDeleteItem}
        refresh={refresh}
        editable={editable}
        setEditable={setEditable}
        createable={createable}
        setCreateable={setCreateable}
        changeState={changeState}
        searchContent={searchTimeseriesContent}
        setSearchContent={setSearchTimeseriesContent}
        searchTimeseries={searchTimeseries}
      />
      <AddModal
        addModalVisible={addModalVisible}
        setAddModalVisible={setAddModalVisible}
        initItem={initItem}
        searchContent={searchContent}
      />
      <EditStorageModal
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
        editItem={editItem}
        initItem={initItem}
        searchContent={searchContent}
      />
    </div>
  );
};
export default BasicList;
