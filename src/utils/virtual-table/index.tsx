import {CheckOutlined, CloseOutlined, UndoOutlined, LockOutlined,
  UnlockOutlined} from '@ant-design/icons';
import React, { useRef, useEffect, useContext, createContext, useReducer, useState, useMemo,
  Fragment } from 'react'
import { throttle, isNumber } from 'lodash-es'
import {Typography, Form, Input, InputNumber, Popconfirm, Table, notification, Button ,Tooltip,
 Divider} from 'antd';
import moment from "moment";
enum dispatchType {
  INITHEIGHT = 'INITHEIGHT',
  RENDERTR = 'RENDERTR',
  RESET = 'RESET',
}
const theInitialState = {
  // 行高度
  rowHeight: 0,
  // 当前的scrollTop
  curScrollTop: 0,
  // 可滚动区域的高度
  scrollHeight: 0,
  // scrollY值
  tableScrollY: 0,
}
function reducer(state: any, action: any) {
  let curScrollTop = action.curScrollTop
  let scrollHeight = action.scrollHeight
  const tableScrollY = action.tableScrollY
  const rowHeight = action.rowHeight
  switch (action.type) {
    // 改变 trs 即 改变渲染的列表 trs
    case dispatchType.RENDERTR:
      if (scrollHeight < 0) scrollHeight = 0

      if (state.scrollHeight && tableScrollY === state.tableScrollY) {
        scrollHeight = state.scrollHeight
      }

      if (state.scrollHeight && curScrollTop > state.scrollHeight) {
        curScrollTop = state.scrollHeight
      }

      return {
        ...state,
        curScrollTop,
        scrollHeight,
        tableScrollY,
      }
    // 初始化每行的高度, 表格总高度, 渲染的条数
    case dispatchType.INITHEIGHT:
      return {
        ...state,
        rowHeight,
      }
    case dispatchType.RESET:
      return {
        ...state,
        curScrollTop: 0,
        scrollHeight: 0,
      }
    default:
      throw new Error()
  }
}

// ============== context ============== //
const ScrollContext: any = createContext({
  dispatch: Function,
  renderLen: 1,
  start: 0,
  offsetStart: 0,
  rowHeight: theInitialState.rowHeight,
  totalLen: 0,
})

// ==============常量 ================== //
let scrollY: number | string = 0
let reachEnd: (() => void) | null | undefined = null

//  Cell 组件
const VCell = (props: any): JSX.Element => {
  const { children, ...restProps } = props

  return (
    <td {...restProps}>
      <div>zxc</div>
    </td>
  )
}

//  Row 组件
const VRow = (props: any): JSX.Element => {
  const { dispatch, rowHeight, totalLen } = useContext(ScrollContext)

  const { children, ...restProps } = props

  const trRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    const initHeight = (trRef: any) => {
      if (trRef?.current?.offsetHeight && !rowHeight && totalLen) {
        const tempRowHeight = trRef?.current?.offsetHeight ?? 0
        dispatch({
          type: dispatchType.INITHEIGHT,
          rowHeight: tempRowHeight,
        })
      }
    }

    initHeight(trRef)
  }, [trRef, rowHeight, totalLen, dispatch])

  return (
    <tr
      {...restProps}
      ref={trRef}
      style={{
        height: rowHeight ? rowHeight : 'auto',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </tr>
  )
}

const VWrapper = (props: any): JSX.Element => {
  const { children, ...restProps } = props

  const { renderLen, start, offsetStart } = useContext(ScrollContext)

  const contents = children[1]

  let tempNode = null
  if (Array.isArray(contents) && contents.length) {
    tempNode = [
      children[0],
      contents.slice(start, start + renderLen).map((item) => {
        if (Array.isArray(item)) {
          // 兼容antd v4.3.5 --- rc-table 7.8.1及以下
          return item[0]
        } else {
          // 处理antd ^v4.4.0  --- rc-table ^7.8.2
          return item
        }
      }),
    ]
  } else {
    tempNode = children
  }

  return (
    <tbody {...restProps} style={{ transform: `translateY(-${offsetStart}px)` }}>
      {tempNode}
    </tbody>
  )
}
let wrapTableRef = null;
const VTable = (props: any): JSX.Element => {
  const { style, children, ...rest } = props

  const [state, dispatch] = useReducer(reducer, theInitialState)
  // const wrapTableRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  // 数据的总条数
  const [totalLen, setTotalLen] = useState<number>(children[1]?.props?.data?.length ?? 0)

  useEffect(() => {
    if (children[1]?.props?.data?.length) {
      setTotalLen(children[1]?.props?.data?.length)
    }
  }, [children])

  // table总高度
  const tableHeight = useMemo<string | number>(() => {
    let temp: string | number = 'auto'
    if (state.rowHeight && totalLen) {
      temp = state.rowHeight * totalLen + 10
    }
    return temp
  }, [state.rowHeight, totalLen])

  // table的scrollY值
  let tableScrollY = 0
  if (typeof scrollY === 'string') {
    tableScrollY = (wrapTableRef.current?.parentNode as HTMLElement)?.offsetHeight
  } else {
    tableScrollY = scrollY
  }

  if (isNumber(tableHeight) && tableHeight < tableScrollY) tableScrollY = tableHeight as number

  // 处理tableScrollY <= 0的情况
  if (tableScrollY <= 0) tableScrollY = 0

  // 渲染的条数
  const renderLen = useMemo<number>(() => {
    let temp = 1
    if (state.rowHeight && totalLen && tableScrollY) {
      if (tableScrollY <= 0) {
        temp = 0
      } else {
        const tempRenderLen = ((tableScrollY / state.rowHeight) | 0) + 1 + 2
        temp = tempRenderLen > totalLen ? totalLen : tempRenderLen
      }
    }
    return temp
  }, [state.rowHeight, totalLen, tableScrollY])

  // 渲染中的第一条
  let start = state.rowHeight ? (state.curScrollTop / state.rowHeight) | 0 : 0
  // 偏移量
  let offsetStart = state.rowHeight ? state.curScrollTop % state.rowHeight : 0

  // 用来优化向上滚动出现的空白
  if (state.curScrollTop && state.rowHeight && state.curScrollTop > state.rowHeight) {
    if (start > totalLen - renderLen) {
      offsetStart = 0
    } else if (start > 1) {
      start = start - 1
      offsetStart += state.rowHeight
    }
  } else {
    start = 0
  }

  useEffect(() => {
    const parentNode = wrapTableRef?.current?.parentNode as HTMLElement
    if (parentNode) parentNode.scrollTop = 0
    dispatch({ type: dispatchType.RESET })
  }, [totalLen])

  useEffect(() => {
    const throttleScroll = throttle((e) => {
      const scrollTop: number = e?.target?.scrollTop ?? 0
      const scrollHeight: number = e?.target?.scrollHeight ?? 0
      const clientHeight: number = e?.target?.clientHeight ?? 0

      // 到底了
      if (scrollTop === scrollHeight) {
        // 没有滚动条的情况
        reachEnd && reachEnd()
      } else if (scrollTop + clientHeight === scrollHeight) {
        // 有滚动条的情况
        reachEnd && reachEnd()
      }

      if (scrollTop !== state.curScrollTop) {
        const scrollHeight = e.target.scrollHeight - tableScrollY
        dispatch({
          type: dispatchType.RENDERTR,
          curScrollTop: scrollTop,
          scrollHeight,
          tableScrollY,
        })
      }
    }, 60)

    const ref = wrapTableRef?.current?.parentNode as HTMLElement

    if (ref) ref.addEventListener('scroll', throttleScroll)

    return () => {
      ref?.removeEventListener('scroll', throttleScroll)
    }
  }, [wrapTableRef, state.curScrollTop, tableScrollY, state.scrollHeight])

  return (
    <div
      ref={wrapTableRef}
      style={{
        width: '100%',
        position: 'relative',
        height: tableHeight,
        boxSizing: 'border-box',
        paddingTop: state.curScrollTop,
      }}
    >
      <ScrollContext.Provider
        value={{
          dispatch,
          start,
          offsetStart,
          renderLen,
          totalLen,
          rowHeight: state.rowHeight,
        }}
      >
        <table
          {...rest}
          ref={tableRef}
          style={{
            width: '100%',
            position: 'relative',
            ...style,
          }}
        >
          {children}
        </table>
      </ScrollContext.Provider>
    </div>
  )
}

const BuildEditableTable = (props) => {
  const { columns, scroll, sticky, pagination, editingKey, setEditingKey, form, updatePoint, data,
    setData, active, rowKey, clearEditable, wrapTableRef, timeDisplayForm } = props;
  const isEditing = (record) => record[rowKey] === editingKey;
  const [isChange, setChange] = useState({});
  const inputRef = React.useRef<any>(null);
  const sharedProps = {
    ref: inputRef,
  };
  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record;
    index: number;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> :
    <Input readOnly={isChange[dataIndex]==true?false:true}
      addonAfter={
        (dataIndex!=null && dataIndex.indexOf('.')<0)?null:isChange[dataIndex]==true?
        <>
        <a title='unsave'><CloseOutlined style={{ color: '#fc4c2f' }}
          onClick={async (e)=>{
            let t = {};
            t[dataIndex]=record[dataIndex];
            form.setFieldsValue({...t});
            isChange[dataIndex]=false;
            setChange({...isChange});
          }}/></a>
        <Divider type="vertical" />
        <a title='save'
          onClick={async (e)=>{
            let ret = await updatePoint(record['Time'],dataIndex,form.getFieldsValue()[dataIndex]);
            isChange[dataIndex]=false;
            setChange({...isChange});
            if(ret!=null && ret.message!=null){
              if(ret.code=='0'){
                const row = (await form.validateFields()) ;
                row[dataIndex] = ret.data;
                form.setFieldsValue({...row});
                const newData = [...data[active]];
                data[active] = newData;
                const index = newData.findIndex(item => record[rowKey] === item[rowKey]);
                if (index > -1) {
                  let item = newData[index];
                  item[dataIndex] = row[dataIndex];
                  data[active] = newData;
                  setData({...data});
                }
              }else{
                notification.error({
                  message: ret.message,
                });
                let t = {};
                t[dataIndex]=record[dataIndex];
                form.setFieldsValue({...t});
              }
            }
          }}
        ><CheckOutlined style={{ color: '#1890ff' }} /></a>
        </>
      :
      <a title='click to unlock' onClick={()=>{
        isChange[dataIndex]=true;
        setChange({...isChange});
      }}>
        <LockOutlined />
      </a>
      } />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              // {
              //   required: true,
              //   message: `Please Input ${title}!`,
              // },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };


  if(columns.length>1){
    columns[0].render = (_: any, record) => {
      return (<span>
        {data[active][record.index-1][columns[0].key]}
        <div>
          &nbsp;
        </div>
        </span>)
    }
    columns[1].render = (_: any, record) => {
      if(columns[1].key=='Time'){
        const editable = isEditing(record);
        return editable ? (
          <span>
          {data[active][record.index-1].Time}
          <div>
            <Typography.Link onClick={cancel} >
              finish
            </Typography.Link>
          </div>
          </span>
        ) : (
          <span>
          {timeDisplayForm[active]=='utc'?moment(parseInt(data[active][record.index-1].Time)).
          utc().format('YYYY-MM-DD HH:mm:ss.SSS') : data[active][record.index-1].Time}
          <div>
            <Typography.Link onClick={() => onEdit(record)}>
              edit
            </Typography.Link>
          </div>
          </span>
        )}else{
          return data[active][record.index-1][columns[1].key]
        }
    };
  }
  const onEdit = async (record: Partial & { key: React.Key }) => {
    setChange({});
    const row = (await form.validateFields());
    let t = {};
    Object.keys(record).map((item,index)=>{
      if(item!=rowKey){
        t[item]=record[item];
      }
    });
    Object.keys(columns).map((item,index)=>{
      if(record[item] == null){
        t[item]=null;
      }
    })
    form.setFieldsValue({...t})
    setEditingKey(record[rowKey]);
  };

  const cancel = () => {
    clearEditable();
  };

    const mergedColumns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    return (
      <Form form={form} component={false}>
        <Table
          components={
            VList({
              height: 450,
              cell: EditableCell,
              wrapTableRef: wrapTableRef,
            })
          }
          bordered
          rowKey={rowKey}
          dataSource={data[active]}
          columns={mergedColumns}
          rowClassName="editable-row"
          scroll={scroll}
          sticky={sticky}
          pagination={pagination}
        />
      </Form>
    );
  };

/**
 * https://github.com/ant-design/ant-design/blob/1c85bb3b6231a01c53c53204846a03c4cfdf41f9/components/table/interface.tsx#L39
 * @param props 导出
 */
export const VList = (props: {cell, height: string | number; onReachEnd?: () => void }) => {
  scrollY = props.height
  reachEnd = props.onReachEnd
  wrapTableRef = props.wrapTableRef
  return {
    table: VTable,
    body: {
      wrapper: VWrapper,
      row: VRow,
      // cell: VCell,
      cell: props.cell,
    },
  }
}

export const EditableTable = (props: {}) => {
  return BuildEditableTable(props);
}
