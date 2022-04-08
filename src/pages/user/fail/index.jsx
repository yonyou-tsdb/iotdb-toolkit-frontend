import { Button, Result } from 'antd';
import { Link } from 'umi';
import React from 'react';
import styles from './style.less';
const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large">返回首页</Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => {
  const status = location.query.status ? location.query.status : 'FAIL';
  return (
    <Result
      className={styles.registerResult}
      status="error"
      title={
        <div className={styles.title}>
          <span>{status}</span>
        </div>
      }
      extra={actions}
    />
  );
};

export default RegisterResult;
