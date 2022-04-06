import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Button, Result, Form } from 'antd';
import moment from 'moment';
import { useIntl } from 'umi';
const OperationModal = (props) => {
const intl = useIntl();
const { done, visible, current, onDone, onSubmit, children, isReadonly, doneResultStatus, doneResultTitle,
  onTest } = props;
  if (!visible) {
    return null;
  }
  const [form] = Form.useForm();
  return (
    <ModalForm
      form={form}
      visible={visible}
      autoComplete="off"
      title={intl.formatMessage({
        id: 'connectionList.detail.title',
      })}
      className={styles.standardListForm}
      width={640}
      submitter={
        {
          submitButtonProps: {
            style: {
              display: (isReadonly||done)?'none':'display',
            },
          },
          render: (props, defaultDoms) => {
            return [
              <Button
                key="test"
                style={{
                  display: (done)?'none':'display',
                }}
                onClick={() => {
                  onTest(form, current.id);
                }}
              >
                {intl.formatMessage({
                  id: 'header.datasource-manage.test',
                })}
              </Button>,
              ...defaultDoms,
            ];
          },
        }
      }
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
      onFinish={(values)=>{
        onSubmit(values, current.id);
      }}
    >
      {!done ? (
        <>
          <ProFormText
            name="connectionName"
            label={intl.formatMessage({
              id: 'header.datasource-manage.connection-name',
            })}
            disabled={isReadonly?true:false}
            initialValue={current.alias}
            rules={[
              {
                required: true,
                max: 15,
                message: (useIntl().formatMessage({
                  id: 'header.datasource-manage.connection-name.require',
                })+" (No more than 15 character)"),
              },
            ]}
          />
          <ProFormText
            name="ip"
            label={intl.formatMessage({
              id: 'header.datasource-manage.ip',
            })}
            disabled={isReadonly?true:false}
            initialValue={current.host}
            rules={[
              {
                required: true,
                max: 64,
                message: (useIntl().formatMessage({
                  id: 'header.datasource-manage.ip.require',
                })+" (No more than 64 character)"),
              },
            ]}
          />
          <ProFormDigit
            name="port"
            label={intl.formatMessage({
              id: 'header.datasource-manage.port',
            })}
            disabled={isReadonly?true:false}
            initialValue={current.port}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'header.datasource-manage.port.require',
                }),
              },
            ]}
          />
          <ProFormDateTimePicker
            name="connectionCreateTime"
            label={intl.formatMessage({
              id: 'connectionList.detail.createTime',
            })}
            disabled={true}
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            initialValue={moment(parseInt(current.createTime)).format('YYYY-MM-DD HH:mm')}
          />
          <ProFormText
            name="connectionUsername"
            label={intl.formatMessage({
              id: 'header.datasource-manage.username',
            })}
            disabled={isReadonly?true:false}
            initialValue={current.username}
            rules={[
              {
                required: true,
                max: 20,
                message: (useIntl().formatMessage({
                  id: 'header.datasource-manage.username.require',
                })+" (No more than 20 character)"),
              },
            ]}
          />
          {isReadonly ? (
            null
          ) : (
            <ProFormText.Password
              name="connectionPassword"
              label={intl.formatMessage({
                id: 'header.datasource-manage.password',
              })}
              initialValue=' '
              rules={[
                {max: 20},
                {
                    validator: (rule, value, cbfn) => {
                        if (value.trim()==='') {
                            cbfn(intl.formatMessage({
                              id: 'header.datasource-manage.password.require',
                            }));
                        }
                        cbfn()
                    },
                },
              ]}
              fieldProps={{
                visibilityToggle: false,
              }}
            />
          )}
        </>
      ) : (
        <Result
          status={doneResultStatus}
          title={doneResultTitle}
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};

export default OperationModal;
