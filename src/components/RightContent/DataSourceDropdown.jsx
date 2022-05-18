import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined, FileAddOutlined, DatabaseOutlined,
  ExpandOutlined, EllipsisOutlined, PlusOutlined, SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, } from 'antd';
import { history, useModel, useIntl, useState, useRequest } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import { connectionLessUsingPOST } from '@/services/swagger1/connectionController';
import CookieUtil from '../../utils/CookieUtil';
/**
 * 退出登录，并且将当前的 url 保存
 */
const DataSourceDropdown = ({ menu }) => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { getItem, addItem } = CookieUtil;
  const selectConnection = (item) => {
    const jsessionid = getItem('JSESSIONID');
    addItem(jsessionid+"-alias", item.alias, '/');
    addItem(jsessionid+"-host", item.host, '/');
    addItem(jsessionid+"-port", item.port, '/');
    addItem(jsessionid+"-username", item.username, '/');
    addItem(jsessionid+"-tenantId", item.id, '/');
    setInitialState({ ...initialState, activeConnection: item ,
      activeConnectionDesc: item.username+'@'+item.host+':'+item.port});
  };
  const selectedConnectionDesc = () => {
    const activeConnection = initialState.activeConnection;
    if(activeConnection == null || activeConnection.id == null){return null;}
    const alias = activeConnection.alias;
    const host = activeConnection.host;
    const port = activeConnection.port;
    const username = activeConnection.username;
    return alias+' => '+username+'@'+host+':'+port;
  }
  const reloadMenu = async() => {
    const ret = await connectionLessUsingPOST({
      umi_locale: localStorage.getItem("umi_locale"),
    });
    if(ret.code == '0'){
      setInitialState({ ...initialState, connectionLess: ret.data });
    }
  }
  const createConnection = () => {
      setInitialState({ ...initialState, newConnectionVisable: true });
  }
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser, connectionLess } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }



  const menuHeaderDropdown = (
    <Menu className={styles.menu} >
      {menu && (
        <Menu.Item key={-1} onClick={createConnection}>
          <PlusOutlined />
          {intl.formatMessage({
            id: 'header.datasource-manage.new-connection',
          })}
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key={-2} onClick={()=>{reloadMenu()}}>
          <SyncOutlined />
          {intl.formatMessage({
            id: 'header.datasource-manage.reload-connection',
          })}
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key={0}>
          <CloseOutlined />
          {intl.formatMessage({
            id: 'header.datasource-manage.hide',
          })}
        </Menu.Item>
      )}
      {connectionLess.totalCount>0?(
        <Menu.Divider />
      ):null}
      {connectionLess.pageItems.map((item) => (
        <Menu.Item key={item.id} onClick={() => selectConnection(item)}>
          <DatabaseOutlined />
          {
            (getItem(getItem('JSESSIONID')+"-tenantId")==item.id||
            (initialState.activeConnection!=null&&initialState.activeConnection.id==item.id))?
            (<b>{item.alias}</b>)
            :
            (item.alias)}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown trigger={['click']} overlay={menuHeaderDropdown} destroyPopupOnHide={true}
      placement='bottomCenter'
    >
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar shape="square" size="small" className={styles.avatar} style={{ backgroundColor: '#FC4C2F' }}
          icon={initialState.activeConnection?(<DatabaseOutlined />):(<EllipsisOutlined />)} alt="avatar" />
        <span className={`${styles.name} anticon`}>
          {selectedConnectionDesc()!=null?selectedConnectionDesc():
          intl.formatMessage({
            id: 'header.datasource-manage.select-a-connection',
          })
        }
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default DataSourceDropdown;
