import React, { useState } from 'react';
import { DownOutlined, PlusOutlined, DatabaseOutlined, ReloadOutlined, CloseCircleFilled } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  notification,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useModel, useIntl } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { connectionAllUsingPOST,
  connectionDeleteUsingPOST, connectionUpdateUsingPOST,
  connectionViewUsingPOST, connectionTestByIdUsingPOST, connectionDefaultUsingPOST,
  connectionUndefaultUsingPOST, } from '@/services/swagger1/connectionController';
import styles from './style.less';
import CookieUtil from '../../../utils/CookieUtil';
const RadioButton = Radio.Button;
const { Search } = Input;

const ListContent = ({ data: { createTime, username } }) => (
  <div className={styles.listContent}>
  </div>
);

export const BasicList = () => {
  const intl = useIntl();
  const [connectList, setConnectList] = useState([]);
  const [connectListTotalCount, setConnectListTotalCount] = useState(undefined);
  const [connectListCurrent, setConnectListCurrent] = useState(undefined);
  const [connectListDefault, setConnectListDefault] = useState(undefined);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isReadonly, setIsReadonly] = useState(false);
  const [doneResultStatus, setDoneResultStatus] = useState(undefined);
  const [doneResultTitle, setDoneResultTitle] = useState(undefined);
  const [searchContent, setSearchContent] = useState(undefined);
  const { getItem, addItem } = CookieUtil;
  const {
    data: listData,
  } = useRequest(async() => {
    const jsessionid = getItem('JSESSIONID');
    const alias = getItem(jsessionid+'-alias');
    const host = getItem(jsessionid+'-host');
    const port = getItem(jsessionid+'-port');
    const username = getItem(jsessionid+'-username');
    const tenant = alias==null?null:{alias:alias, host:host, port:port, username:username, id:jsessionid};
    let ret = await connectionAllUsingPOST({
      pageSize: 10,
      pageNum: 1,
      aliasLike: searchContent,
      umi_locale: localStorage.getItem("umi_locale")
    });
    setInitialState({ ...initialState, activeConnection: tenant,});
    setConnectList(ret.data.pageItems);
    setConnectListTotalCount(ret.data.totalCount);
    setConnectListCurrent(1);
    setConnectListDefault(ret.message)
  });
  let totalCount = listData?.totalCount || 1;
  let paginationProps = {
    showSizeChanger: false,
    showQuickJumper: true,
    pageSize: 10,
    current: connectListCurrent==undefined?1:connectListCurrent,
    total: connectListTotalCount==undefined?totalCount:connectListTotalCount,
    onChange:(current, pageSize)=>{
      change(current, pageSize, searchContent);
    },
  };

  const change = async (current, pageSize, aliasLike)=>{
    let ret2 = await connectionAllUsingPOST({
      pageSize: 10,
      pageNum: current,
      aliasLike: aliasLike,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    setConnectList(ret2.data.pageItems);
    setConnectListTotalCount(ret2.data.totalCount);
    setConnectListCurrent(current);
  }

  const showEditModal = (item1, isReadonly) => {
    setCurrentItem(item1);
    setIsReadonly(isReadonly);
    setVisible(true);
  };

  const deleteItem = async(id) => {
    let ret = await connectionDeleteUsingPOST({
      id: id,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    if(ret.code == '0'){
      notification.success({
        message: ret.message,
      });
      change(1, 10, searchContent);
    }else{
      notification.error({
        message: ret.message,
      });
    }
  };

  const getConnection = async(id) => {
    const ret = await connectionViewUsingPOST({
      connectionId:id,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    if(ret.code==='0'){
      return ret.data;
    }else{
      notification.error({
        message: ret.message,
      });
      return null;
    }
  }

  const viewConnection = async(key, item) => {
    const connection = await getConnection(item.id);
    if(connection != null){
      showEditModal(connection, true);
    }
  }

  const editConnection = async(key, item) => {
    const connection = await getConnection(item.id);
    if(connection != null){
      showEditModal(connection, false);
    }
  }

  const deleteConnection = (key, item) => {
    Modal.confirm({
      title: intl.formatMessage({id: 'connectionList.delete.title',}),
      content: intl.formatMessage({id: 'connectionList.delete.title.confirm',}),
      onOk: () => deleteItem(item.id),
    });
  }

  const setConnectionDefault = async (key, item) => {
    if(item.id==connectListDefault){
      let msg = await connectionUndefaultUsingPOST({
        connectionId:item.id,
        umi_locale: localStorage.getItem("umi_locale"),
      });
      if(msg.code == '0'){
        setConnectListDefault(null);
        notification.success({
          message: item.alias + ' -- ' +
            intl.formatMessage({id: 'pages.connection-list.undefault.success',}),
        });
      }
    }else{
      let msg = await connectionDefaultUsingPOST({
        connectionId:item.id,
        umi_locale: localStorage.getItem("umi_locale")});
      if(msg.code == '0'){
        setConnectListDefault(msg.data);
        notification.success({
          message: item.alias + ' -- ' +
            intl.formatMessage({id: 'pages.connection-list.default.success',}),
        });
      }
    }
  }

  const setConnectionUndefault = async (key, item) => {
  }

  const selectConnection = (item) => {
    const jsessionid = getItem('JSESSIONID');
    addItem(jsessionid+"-tenantId", item.id, '/');
    addItem(jsessionid+"-alias", item.alias, '/');
    addItem(jsessionid+"-host", item.host, '/');
    addItem(jsessionid+"-port", item.port, '/');
    addItem(jsessionid+"-username", item.username, '/');
    setInitialState({ ...initialState, activeConnection: item,
      activeConnectionDesc: item.username+'@'+item.host+':'+item.port });
  }

  const extraContent = (
    <>
      <Button.Group>
      <Button value="all" onClick={() => {
        setSearchContent(null);
        change(1, 10);
      }}><ReloadOutlined />{intl.formatMessage({id: 'pages.refresh.text',})}</Button>
      <Search className={styles.extraContentSearch}
        placeholder={intl.formatMessage({id: 'pages.refresh.placeholder',})}
        onSearch={(value) => {change(1, 10, value);}}
        onChange={(e) => {setSearchContent(e.target.value);}}
        value={searchContent}
        suffix={
            (searchContent==null||searchContent=='')?
            <CloseCircleFilled style={{ display: 'none' }} />:
            <CloseCircleFilled style={{ color: 'rgba(0,0,0,.45)' }} onClick={() => {setSearchContent(null)}}/>
        }
       />
      </Button.Group>
    </>
  );

  const MoreBtn = ({ item }) => (
    <Dropdown
      trigger={['click']}
      overlay={
        <Menu >
          <Menu.Item key="view" onClick={({ key }) => viewConnection(key, item)}>{intl.formatMessage({
            id: 'pages.connection-list.view',
          })}</Menu.Item>
          <Menu.Item key="edit" onClick={({ key }) => editConnection(key, item)}>{intl.formatMessage({
            id: 'pages.connection-list.edit',
          })}</Menu.Item>
          <Menu.Item key="delete" onClick={({ key }) => deleteConnection(key, item)}>{intl.formatMessage({
            id: 'pages.connection-list.delete',
          })}</Menu.Item>
          <Menu.Item key="default" onClick={({ key }) => setConnectionDefault(key, item)}>{intl.formatMessage({
            id: item.id==connectListDefault? 'pages.connection-list.undefault':
              'pages.connection-list.default',
          })}</Menu.Item>
        </Menu>
      }
    >
      <a>
      {intl.formatMessage({
        id: 'pages.connection-list.more',
      })} <DownOutlined />
      </a>
    </Dropdown>
  );

  const handleDone = () => {
    if(doneResultStatus==='success'){
      change(1, 10, searchContent);
    }
    setDone(false);
    setVisible(false);
    setCurrentItem({});
  };

  const handleSubmit = async(values, connectionId) => {
    let ret = await connectionUpdateUsingPOST({
      ...values, connectionId:connectionId,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    if(ret.code == '0'){
      setDoneResultStatus('success');
    }else{
      setDoneResultStatus('error');
    }
    setDoneResultTitle(ret.message);
    setDone(true);
  };

  const handleTest = async(form, connectionId) => {
    try {
      await form.validateFields();
      let msg = await connectionTestByIdUsingPOST({
        ...form.getFieldsValue(),
        connectionId:connectionId,
        umi_locale: localStorage.getItem("umi_locale"),
      });
        let message = msg.message;
        if (msg.code === '0') {
          notification.success({
            message: message,
          });
        }else{
          notification.error({
            message: message,
          });
        }
    } catch (e) {
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
              pagination={paginationProps}
              dataSource={connectList}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    (getItem(getItem('JSESSIONID')+"-tenantId")==item.id||
                    (initialState.activeConnection!=null&&initialState.activeConnection.id==item.id))? (
                      <div>{intl.formatMessage({
                        id: 'pages.connection-list.use-this',
                      })}</div>
                    ):
                      <a
                        key="edit"
                        onClick={(e) => {
                          e.preventDefault();
                          selectConnection(item);
                        }}
                      >
                          {intl.formatMessage({
                            id: 'pages.connection-list.use-this',
                          })}
                      </a>
                    ,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#FC4C2F' }} icon={<DatabaseOutlined />} shape="square" size="large" />}
                    title={item.alias}
                    description={(
                      <>
                        <div>{item.username + '@'}</div>
                        <div>{item.host + ':' + item.port}</div>
                      </>)}
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
        onClick={() => {
          setInitialState({ ...initialState, newConnectionVisable: true });
        }}
        style={{
          width: '100%',
          marginBottom: 8,
        }}
      >
        <PlusOutlined />
        {intl.formatMessage({
          id: 'pages.connection-list.add-connection',
        })}
      </Button>
      <OperationModal
        done={done}
        doneResultStatus={doneResultStatus}
        doneResultTitle={doneResultTitle}
        visible={visible}
        current={currentItem}
        onDone={handleDone}
        onSubmit={handleSubmit}
        onTest={handleTest}
        isReadonly={isReadonly}
      />
    </div>
  );
};
export default BasicList;
