import React, { useState } from 'react';
import { DownOutlined, PlusOutlined, DatabaseOutlined, TeamOutlined, ReloadOutlined, FolderAddOutlined,
  FolderOutlined, CloseCircleFilled } from '@ant-design/icons';
import {Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Progress, Radio, Row, notification, Popconfirm,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useModel, useIntl } from 'umi';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import DateUtil from '../../../utils/DateUtil';
import OperationModal from './components/OperationModal';
import AddModal from './components/AddStorageModal';
import EditStorageModal from './components/EditStorageModal';
import { showTimeseriesWithTenantUsingPOST, changePrivilegesWithTenantUsingPOST,
  showSchemaWithTenantUsingPOST, showStorageWithTenantUsingPOST, showStorageAppendWithTenantUsingPOST,
  deleteStorageGroupWithTenantUsingPOST, deleteTimeseriesWithTenantUsingPOST,
  showTimeseriesAppendWithTenantUsingPOST,
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
  const [currentValue, setCurrentValue] = useState(undefined);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [doneResultStatus, setDoneResultStatus] = useState(undefined);
  const [doneResultTitle, setDoneResultTitle] = useState(undefined);
  const [editable, setEditable] = useState({});
  const [editItem, setEditItem] = useState(undefined);
  const [createable, setCreateable] = useState(false);
  const [searchContent, setSearchContent] = useState(undefined);
  const [searchTimeseriesContent, setSearchTimeseriesContent] = useState(undefined);
  const [pageStorageGroupHasMore, setPageStorageGroupHasMore] = useState(false);
  const [pageStorageGroupToken, setPageStorageGroupToken] = useState(undefined);
  const [pageTimeseriesHasMore, setPageTimeseriesHasMore] = useState(false);
  const [pageTimeseriesToken, setPageTimeseriesToken] = useState(undefined);
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
        <p></p>
      </div>
    </div>
  );
  let totalCount = listData?.length || 1;
  const pageStorageGroupShowTotal = (total) => {
    return pageStorageGroupHasMore?
    <a onClick = {pageStorageGroupAppend}>{intl.formatMessage({id: 'pages.loading.continue',})}</a>
    :null;
  }
  const pageStorageGroupAppend = async() => {
    const ret = await showStorageAppendWithTenantUsingPOST({token:pageStorageGroupToken})
    if(ret.code == '0'){
      let messageJson = JSON.parse(ret.message || '{}');
      setPageStorageGroupHasMore(messageJson.hasMore);
      setPageStorageGroupToken(messageJson.token);
      let size = initialState.manageStorage_self_total.length;
      for(let i=0;i<ret.data.length;i++){
        initialState.manageStorage_self_total[size+i] = ret.data[i];
      }
      if(searchContent != null && searchContent != ''){
        initialState.manageStorage_self = initialState.manageStorage_self_total.filter(
          array => array.value.match(searchContent));
      }else{
        initialState.manageStorage_self = initialState.manageStorage_self_total;
      }
      setInitialState({ ...initialState, manageStorage_self: initialState.manageStorage_self,
        manageStorage_self_totalCount: initialState.manageStorage_self.length,
        manageStorage_self_total: initialState.manageStorage_self_total, });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }
  const pageTimeseriesShowTotal = (total) => {
    return pageTimeseriesHasMore?
    <a onClick = {pageTimeseriesAppend}>{intl.formatMessage({id: 'pages.loading.continue',})}</a>
    :null;
  }
  const pageTimeseriesAppend = async() => {
    const ret = await showTimeseriesAppendWithTenantUsingPOST({token:pageTimeseriesToken});
    if(ret.code=='0'){
      let messageJson = JSON.parse(ret.message || '{}');
      setPageTimeseriesHasMore(messageJson.hasMore);
      setPageTimeseriesToken(messageJson.token);
      let size = currentItem.length;
      for(let i=0;i<ret.data.length;i++){
        currentItem[size+i] = ret.data[i];
      }
      setCurrentItem([]);
      setCurrentItem(currentItem);
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }
  let paginationProps = {
    showTotal: pageStorageGroupShowTotal,
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
    let token = uuid().replaceAll('-','');
    let ret = await showStorageWithTenantUsingPOST({token: token});
    if(ret.code == '0'){
      let messageJson = JSON.parse(ret.message || '{}');
      setPageStorageGroupHasMore(messageJson.hasMore);
      setPageStorageGroupToken(messageJson.token);
      if(filter != null && filter != ''){
        ret.data = ret.data.filter(array => array.value.match(filter));
      }
      setInitialState({ ...initialState, manageStorage_self: ret.data,
        manageStorage_self_totalCount: ret.data.length, manageStorage_self_current: 1,
        manageStorage_self_total: ret.data, });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }
  const change = async (filter)=>{
      let data = initialState.manageStorage_self_total;
      if(filter != null && filter != ''){
        data = data.filter(array => array.value.match(filter));
      }
      setInitialState({ ...initialState, manageStorage_self: data,
        manageStorage_self_totalCount: data.length,
        manageStorage_self_current: 1,
      });
  }

  const showEditModal = async (value) => {
    setSearchTimeseriesContent(null);
    let token = uuid().replaceAll('-','');
    let ret = await showTimeseriesWithTenantUsingPOST({path:value, token:token});
    if(ret.code=='0'){
      let messageJson = JSON.parse(ret.message || '{}');
      setPageTimeseriesHasMore(messageJson.hasMore);
      setPageTimeseriesToken(messageJson.token);
      setCurrentItem(ret.data);
      setCurrentValue(value);
      setVisible(true);
    }else{
      notification.error({
        message: ret.message,
      });
    }
  };

  const searchTimeseries = async (currentValue, filter) => {
    let token = uuid().replaceAll('-','');
    let ret = await showTimeseriesWithTenantUsingPOST({path:currentValue+'.'+filter, token:token});
    if(ret.code=='0'){
      let messageJson = JSON.parse(ret.message || '{}');
      setPageTimeseriesHasMore(messageJson.hasMore);
      setPageTimeseriesToken(messageJson.token);
      setCurrentItem(ret.data);
    }else{
      notification.error({
        message: ret.message,
      });
    }
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
          alert('刷新')
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
      for(let i=0;i<currentItem.length;i++){
        if(currentItem[i].timeseries==record.timeseries){
          currentItem.splice(i,1);
          setCurrentItem([]);
          setCurrentItem(currentItem);
          break;
        }
      }
    }else{
      notification.error({
        message: ret.message,
      });
    }
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
                      onClick={(e) => {showEditModal(item.value)}}
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
        currentValue={currentValue}
        onDone={handleDone}
        onDeleteItem={handleDeleteItem}
        editable={editable}
        setEditable={setEditable}
        createable={createable}
        setCreateable={setCreateable}
        changeState={changeState}
        searchContent={searchTimeseriesContent}
        setSearchContent={setSearchTimeseriesContent}
        searchTimeseries={searchTimeseries}
        pageTimeseriesShowTotal={pageTimeseriesShowTotal}
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
