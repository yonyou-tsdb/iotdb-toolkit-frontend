import React from 'react';
import { List, Modal, notification } from 'antd';
import { history, useModel, useIntl, useRequest  } from 'umi';
import { deleteAccountUsingPOST } from '@/services/swagger1/userController';
const SecurityView = () => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const getData = () => [
    {
      title: intl.formatMessage({id: 'account.setting.security.deleteAccount',}),
      description: (
        <>
          {intl.formatMessage({id: 'account.setting.security.currentAccount',}) + ' :  '}
          {(currentUser!=null && currentUser.name!=null)?currentUser.name:''}
        </>
      ),
      actions: [<a key="Delete" onClick={deleteAccount}>
        {intl.formatMessage({id: 'pages.delete.text',})}
      </a>],
    },
  ];
  const deleteAccount = () => {
    Modal.confirm({
      title: intl.formatMessage({id: 'account.setting.security.deleteAccount',}),
      content: intl.formatMessage({id: 'account.setting.security.deleteAccount.alert',}),
      onOk: () => deleteAccountConfirm(),
    });
  }
  const deleteAccountConfirm = async () => {
    let ret = await deleteAccountUsingPOST();
    if(ret.code=='0'){
      notification.success({
        message: ((currentUser!=null && currentUser.name!=null)?currentUser.name:'') + ' ' +
        intl.formatMessage({id: 'account.setting.security.deleteAccount.success',}),
      });
      history.push({
        pathname: '/user/login',
      });
    }else{
      notification.error({
        message: ret.message,
      });
    }
  }
  const data = getData();
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
