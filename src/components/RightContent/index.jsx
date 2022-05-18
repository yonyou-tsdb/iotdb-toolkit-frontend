
import { Space, Button, Input, Form, notification, Menu, Avatar } from 'antd';
import { QuestionCircleOutlined, BookOutlined, CarryOutOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormTextArea, ProFormDateRangePicker,
  ProFormDependency, ProFormDigit, ProFormRadio, ProFormSelect, ProFormFieldSet } from '@ant-design/pro-form';
import React, { useState } from 'react';
import { useModel, SelectLang, useIntl, FormattedMessage, useRequest } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import DataSourceDropdown from './DataSourceDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { connectionTestUsingPOST, connectionAddThenReturnLessUsingPOST, } from '@/services/swagger1/connectionController';
import CookieUtil from '../../utils/CookieUtil';
import HeaderDropdown from '../HeaderDropdown';
const { getItem, addItem } = CookieUtil;
const GlobalHeaderRight = () => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [ws, setWs] = useState(undefined);
  if (!initialState || !initialState.settings) {
    return null;
  }

  const hostname = location.hostname;
  const port = hostname == "localhost" ? 8080 : location.port;
  const WebsocketUrl = "ws://" + hostname + ":" + port + "/api/websocket/" + CookieUtil.getItem('JSESSIONID');
  useRequest(async() => {
    const jsessionid = getItem('JSESSIONID');
    const id = getItem(jsessionid+'-tenantId');
    const alias = getItem(jsessionid+'-alias');
    const host = getItem(jsessionid+'-host');
    const port = getItem(jsessionid+'-port');
    const username = getItem(jsessionid+'-username');
    const temp = await new WebSocket(WebsocketUrl);
    temp.onopen = function (ev) {
    }
    temp.onclose = function (ev) {
    }
    temp.onmessage = function (me) {
      try{
        const json = JSON.parse(me.data || '{}');
        const key = json.key;
        let btn;
          if(json.type=='EXPORT_START' || json.type=='EXPORT_ONGOING'){
            btn =  (<Button type="primary" danger size="small" onClick={() => {
              let msg = {type: "EXPORT_INTERRUPT", key: json.key};
              temp.send(JSON.stringify(msg));
            }}>
            {intl.formatMessage({
              id: 'query.sql.export.stop',
            })}
            </Button>)
          }else if(json.type=='IMPORT_START' || json.type=='IMPORT_ONGOING'){
            btn =  (<Button type="primary" danger size="small" onClick={() => {
              let msg = {type: "IMPORT_INTERRUPT", key: json.key};
              temp.send(JSON.stringify(msg));
            }}>
            {intl.formatMessage({
              id: 'query.sql.export.stop',
            })}
            </Button>)
          }
        ;
        notification.warn({
          message: json.message,
          duration: json.type == 'CONNECT_SUCCESS' ? 4.5 : 0,
          placement: 'bottomRight',
          btn,
          key,
        });
      }catch(error){
      }
    }
    temp.onerror = function (ev) {
        console.log(ev);
    }
    setWs(temp);
    const desp = intl.formatMessage({
      id: 'header.datasource-manage.select-a-connection',
    });
    setInitialState({ ...initialState, activeConnection: {id:id, alias:alias, host:host, port:port,
      username:username}, activeConnectionDesc: (username==null&&host==null&&port==null)?
      desp:(username+'@'+host+':'+port)});
  });


  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const [form] = Form.useForm();

  const onMenuClick = (event) =>{
  }
  return (
    <Space className={className}>
      <DataSourceDropdown menu />
      <AvatarDropdown menu />
      <SelectLang className={styles.action} />
      <ModalForm
        title={intl.formatMessage({
          id: 'header.datasource-manage.new-connection',
        })}
        width="600px"
        form={form}
        visible={(initialState.newConnectionVisable)?true:false}
        modalProps={{
          onCancel: () => {
            setInitialState({ ...initialState, newConnectionVisable: false });
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          let msg = await connectionAddThenReturnLessUsingPOST(
            {...values, umi_locale: localStorage.getItem("umi_locale")});
          if (msg.code === '0') {
            notification.success({
              message: msg.message,
            });

            // connectionLess
            setInitialState({ ...initialState, newConnectionVisable: false, connectionLess: msg.data});
          }else{
            notification.error({
              message: msg.message,
            });
          }
        }}
      >
        <ProFormText
          width="md"
          label={intl.formatMessage({
            id: 'header.datasource-manage.connection-name',
          })}
          name="alias"
          rules={[
            {
              required: true,
              max: 15,
              message: (intl.formatMessage({
                id: 'header.datasource-manage.connection-name.require',
              })+" (No more than 15 character)"),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'header.datasource-manage.connection-name.require',
          })}
          width="md"
          name="connectionName"
        />

          <ProFormText
            width="md"
            label={intl.formatMessage({
              id: 'header.datasource-manage.ip',
            })}
            name="ip"
            rules={[
              {
                required: true,
                max: 64,
                message: (intl.formatMessage({
                  id: 'header.datasource-manage.ip.require',
                })+" (No more than 64 character)"),
              },
            ]}
            placeholder={intl.formatMessage({
              id: 'header.datasource-manage.ip.require',
            })}
          />

          <ProFormDigit
            label={intl.formatMessage({
              id: 'header.datasource-manage.port',
            })}
            name="port"
            min={1}
            max={65535}
            width="xs"
            fieldProps={{
              formatter: (value) => `${value || ''}`,
              parser: (value) => (value ? value.replace('%', '') : '6667'),
            }}
            rules={[
              {
                required: true,
                message: (intl.formatMessage({
                  id: 'header.datasource-manage.port.require',
                })),
              },
            ]}
          />
          <ProFormText
            width="md"
            label={intl.formatMessage({
              id: 'header.datasource-manage.username',
            })}
            name="connectionUsername"
            placeholder={intl.formatMessage({
              id: 'header.datasource-manage.username.require',
            })}
            rules={[
              {
                required: true,
                max: 20,
                message: (intl.formatMessage({
                  id: 'header.datasource-manage.username.require',
                })+" (No more than 20 character)"),
              },
            ]}
          />
          <ProFormText.Password
            width="md"
            label={intl.formatMessage({
              id: 'header.datasource-manage.password',
            })}

            name="connectionPassword"
            fieldProps={{
              visibilityToggle: false,
            }}
            placeholder={intl.formatMessage({
              id: 'header.datasource-manage.password.require',
            })}
            rules={[
              {
                required: true,
                max: 20,
                message: (intl.formatMessage({
                  id: 'header.datasource-manage.password.require',
                })+" (No more than 20 character)"),
              },
            ]}
          />
          <ProFormFieldSet
            name="testConnect"
            tooltip={intl.formatMessage({
              id: 'header.datasource-manage.test-connect-tooltip',
            })}
            label={intl.formatMessage({
              id: 'header.datasource-manage.test-connect',
            })}
          >
            <Button
              onClick={async () => {
                try {
                  await form.validateFields();
                  let msg = await connectionTestUsingPOST({
                    ...form.getFieldsValue(),
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
              }}
            >
              {intl.formatMessage({
                id: 'header.datasource-manage.test',
              })}
            </Button>
          </ProFormFieldSet>

      </ModalForm>
    </Space>
  );
};

export default GlobalHeaderRight;
