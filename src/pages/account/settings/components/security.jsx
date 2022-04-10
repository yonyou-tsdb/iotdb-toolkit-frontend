import React from 'react';
import { List, Modal, notification } from 'antd';
import { history, useModel, useIntl, useRequest  } from 'umi';
import { deleteAccountUsingPOST } from '@/services/swagger1/userController';
const SecurityView = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const getData = () => [
    {
      title: '删除账号',
      description: (
        <>
          当前帐号：
          {(currentUser!=null && currentUser.name!=null)?currentUser.name:''}
        </>
      ),
      actions: [<a key="Delete" onClick={deleteAccount}>删除</a>],
    },
  ];
  const deleteAccount = () => {
    Modal.confirm({
      title: '删除账号',
      content: '是否删除此账号及相关一切内容？（不可恢复）',
      onOk: () => deleteAccountConfirm(),
    });
  }
  const deleteAccountConfirm = async () => {
    let ret = await deleteAccountUsingPOST();
    if(ret.code=='0'){
      notification.success({
        message: ((currentUser!=null && currentUser.name!=null)?currentUser.name:'') + '账号成功删除',
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
