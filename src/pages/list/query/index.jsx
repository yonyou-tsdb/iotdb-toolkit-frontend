import {MenuOutlined, EllipsisOutlined, InfoCircleOutlined, PlayCircleOutlined,
  SaveOutlined, PauseCircleOutlined, PlusCircleOutlined, CloseCircleOutlined,
  FileSearchOutlined, LineChartOutlined,
  ExportOutlined, ImportOutlined, SearchOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Badge, Button, Card, Statistic, Descriptions, Divider, Dropdown, Menu, Popover, Table, Tooltip, Empty,
  notification, Upload, Typography, Form, Input, InputNumber, Popconfirm, Select, Radio } from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useRequest, useModel, useIntl } from 'umi';
import { queryAdvancedProfile } from './service';
import { querySqlWithTenantUsingPOST, queryAllUsingPOST,
  querySqlAppendWithTenantUsingPOST, updatePointWithTenantUsingPOST,
 } from '@/services/swagger1/queryController';
import styles from './style.less';
import CommonUtil from '../../../utils/CommonUtil';
import OperationModal from './components/OperationModal';
import AddQueryModal from './components/AddQueryModal';
import ExportModal from './components/ExportModal';
import ImportModal from './components/ImportModal';
import { format as sqlFormat } from 'sql-formatter';
import {UnControlled as CodeMirror} from '../../../../node_modules/react-codemirror2'
import '../../../../node_modules/codemirror/lib/codemirror.css';
import '../../../utils/iotdb-sql/iotdb-sql';
import '../../../../node_modules/codemirror/theme/juejin.css';
import '../../../../node_modules/codemirror/addon/hint/show-hint.css';
import '../../../../node_modules/codemirror/addon/hint/show-hint';
import '../../../../node_modules/codemirror/addon/hint/sql-hint';
import '../../../../node_modules/codemirror/addon/comment/comment';
import { v4 as uuid } from 'uuid';
import { VList, EditableTable } from '../../../utils/virtual-table';
import { VisualMiniArea } from '../../../utils/visualization-data';
import {BetterInputNumber} from '../../../utils/BetterInputNumber';
import ExportJsonExcel from "js-export-excel";
const { Option } = Select;
const Self = () => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [querySql, setQuerySql] = useState({'query1':'SHOW STORAGE GROUP'});
  const [activeQueryTabkey, setActiveQueryTabkey] = useState('query1');
  const activeQueryTabkeyRef = useRef('query1');
  useEffect(() => {
    activeQueryTabkeyRef.current = activeQueryTabkey
  }, [activeQueryTabkey])
  const [readOnly, setReadOnly] = useState(false);
  const [sqlModalVisible, setSqlModalVisible] = useState(false);
  const [sqlModalContent, setSqlModalContent] = useState(undefined);
  const [addQueryVisible, setAddQueryVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [queryTabTokens, setQueryTabTokens] = useState({});
  const queryTabTokensRef = useRef([]);
  useEffect(() => {
    queryTabTokensRef.current = queryTabTokens
  }, [queryTabTokens])
  const wrapTableRef = useRef(null);
  let contentList = null;
  const codeMirror = (
    <CodeMirror
      value={querySql[activeQueryTabkey]}
      options={{
        mode: 'text/iotdb-sql',
        theme: 'juejin',
        autofocus: true,
        lineNumbers: true,
        tabindex: 1,
        extraKeys: {
          "Alt-/": "autocomplete",
          "Cmd-/": "toggleComment",
          "Ctrl-/": "toggleComment",
          'Shift-Cmd-F': ()=>{formatQuery()},
          'Shift-Ctrl-F': ()=>{formatQuery()},
          'F8': ()=>{runQuery()},
        },
        matchBrackets: true,
        readOnly: readOnly,
        indentWithTabs: true,
        smartIndent: true,
        hintOptions: {
          completeSingle: false
        },
        autofocus: false,
      }}
      onChange={(editor, data, value) => {
        if(data.origin!=null&&((data.removed[0].trim()!='') || data.text[0].match(/^[a-zA-Z0-9_]+$/)) ){
          editor.showHint();
        }
        querySql[activeQueryTabkey]=value;
      }}
    />
  );
  const [tabStatus, setTabStatus] = useState({
    tabActiveKey: 'tab1',
    operationKey: 'query1',
  });
  const [resultMessage, setResultMessage] = useState({});
  const resultMessageRef = useRef([]);
  useEffect(() => {
    resultMessageRef.current = resultMessage
  }, [resultMessage])
  const [resultColumn, setResultColumn] = useState([]);
  const resultColumnRef = useRef([]);
  useEffect(() => {
    resultColumnRef.current = resultColumn
  }, [resultColumn])
  const [resultData, setResultData] = useState([]);
  const resultDataRef = useRef([]);
  useEffect(() => {
    resultDataRef.current = resultData
  }, [resultData])
  const [resultSize, setResultSize] = useState([]);
  const [resultTimeCost, setResultTimeCost] = useState([]);
  const [timeDisplayForm, setTimeDisplayForm] = useState([]);
  const [queryToken, setQueryToken] = useState([]);
  const [columns, setColumns] = useState([{}]);
  const [editingKey, setEditingKey] = useState('');
  const [resultLocatorIndex, setResultLocatorIndex] = useState({});
  const [resultLocatorValue, setResultLocatorValue] = useState([]);
  const [resultGraphicalColumn, setResultGraphicalColumn] = useState([]);
  const resultGraphicalColumnRef = useRef([]);
  useEffect(() => {
    resultGraphicalColumnRef.current = resultGraphicalColumn;
  }, [resultGraphicalColumn]);
  const [editableForm] = Form.useForm();
  const resultLocator =
  <>
    <Divider type="vertical" />
    <span>{intl.formatMessage({id: 'query.result.locate.text',})} </span>
    <BetterInputNumber style={{
      width: 170,
      size: "small",
    }} placeholder="index or Time.."
      min={0}
      max={9223372036854775807}
      onChange={(v)=>{
        resultLocatorValue[activeQueryTabkey]=v;
        setResultLocatorValue({...resultLocatorValue});
      }}
      onPressEnter={()=>{
        resultLocateToIndex();
      }}
     addonAfter={
      <>
      <a onClick={()=>{resultLocateToIndex()}} >index </a>
      <Divider type="vertical" />
      {intl.formatMessage({id: 'query.result.locate.or',})}
      <Divider type="vertical" />
      <a onClick={()=>{resultLocateToByTime()}} >Time </a>
      </>
    } />
    <Divider type="vertical" />
    <Select placeholder={intl.formatMessage({id: 'query.result.time.displayAs',})}
      style={{ width:140 }} onChange={(v)=>{changeTimeDisplayForm(v)}}
     >
      <Option value="number">Number</Option>
      <Option value="utc">UTC</Option>
    </Select>
    <Divider type="vertical" />
    <a onClick={()=>{
      let header = resultColumnRef.current[activeQueryTabkey].map((item,index)=>{
            return item.title;
      }).filter(item => item!='index');
      exportExcel(activeQueryTabkey,header,resultDataRef.current[activeQueryTabkey]);
    }}>{intl.formatMessage({id: 'query.result.download',})}</a>
  </>;
  const exportExcel = (sheetName,sheetHeader,sheetData) => {
    let option = {};
    option.fileName = sheetName;
    let columnWidths = sheetHeader.map((item,index)=>{
          return 10;
    });
    option.datas = [
        {
            sheetData: sheetData,
            sheetName: sheetName,
            sheetFilter: sheetHeader,
            sheetHeader: sheetHeader,
            columnWidths: columnWidths,
        },
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  }
  const changeTimeDisplayForm = (v) => {
    timeDisplayForm[activeQueryTabkey] = v;
    setTimeDisplayForm({...timeDisplayForm});
  }
  const resultLocateToIndex = () => {
    resultLocatorIndex[activeQueryTabkey] = resultLocatorValue[activeQueryTabkey];
    setResultLocatorIndex({...resultLocatorIndex});
    resultLocateTo();
  }
  const resultLocateToByTime = () => {
    if(resultColumnRef.current[activeQueryTabkey][1].title=='Time'){
      let ceilingItem = resultDataRef.current[activeQueryTabkey].find(
        item => item.Time >= resultLocatorValue[activeQueryTabkey]);
      ceilingItem = ceilingItem == null?
        resultDataRef.current[activeQueryTabkey][resultDataRef.current[activeQueryTabkey].length-1]:ceilingItem;
      resultLocatorIndex[activeQueryTabkey] = ceilingItem.index;
      setResultLocatorIndex({...resultLocatorIndex});
      resultLocateTo();
    }
  }
  const resultLocateTo = () => {
    let index = resultLocatorIndex[activeQueryTabkey]==null?0:resultLocatorIndex[activeQueryTabkey];
    index = index < 1 ? 1 : index;
    let top = 77 * (index - 1);
    wrapTableRef.current.parentNode.scrollTop=top;
  }
  const queryAppend = async() => {
    resultMessageRef.current[activeQueryTabkey]=(
      <>
      <span >
        {`${activeQueryTabkey} ` +
          intl.formatMessage({id: 'query.result.cost.text',})
          + ` ${resultTimeCost[activeQueryTabkey]} ms`}
          <Divider type="vertical" />
        {intl.formatMessage({id: 'query.result.return.text',})
          + ` ${resultSize[activeQueryTabkey]} `
          + intl.formatMessage({id: 'query.result.return.rows',})}
          <Divider type="vertical" />
        {intl.formatMessage({id: 'query.result.load.ing',})}
      </span>
      {resultLocator}
      </>
    );
    let tabToken = uuid().replaceAll('-','');
    queryTabTokens[activeQueryTabkeyRef.current] = tabToken;
    setQueryTabTokens({...queryTabTokens});
    let ret = await querySqlAppendWithTenantUsingPOST({
      queryToken: queryToken[activeQueryTabkey],
      tabKey: activeQueryTabkeyRef.current, tabToken: tabToken,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    if(ret.code=='0'){
      resultColumn[activeQueryTabkey]=[];
      let messageJson = JSON.parse(ret.message || '{}');
      if(messageJson.tabToken != queryTabTokensRef.current[messageJson.tabKey]){
        notification.error({
          message: intl.formatMessage({id: 'query.result.expired',}),
        });
        return;
      }
      let data = ret.data == null? [] : ret.data;
      let l = resultDataRef.current[activeQueryTabkey].length;
      resultSize[activeQueryTabkey]=l+data.length;
      setResultSize({...resultSize});
      if(messageJson.hasMore){
        resultMessageRef.current[activeQueryTabkey]=(
          <>
          <span>
            {`${activeQueryTabkey} ` +
              intl.formatMessage({id: 'query.result.cost.text',}) +
              ` ${resultTimeCost[activeQueryTabkey]} ms`}
              <Divider type="vertical" />
            {intl.formatMessage({id: 'query.result.return.text',})
              + ` ${resultSize[activeQueryTabkey]} `
              + intl.formatMessage({id: 'query.result.return.rows',})}
              <Divider type="vertical" />
          </span>
          <a onClick={() => {queryAppend()}}>{intl.formatMessage({id: 'query.result.load.next',})}</a>
          {resultLocator}
          </>
        );
      }else{
        resultMessageRef.current[activeQueryTabkey]=(
          <>
          <span >
            {`${activeQueryTabkey} ` +
              intl.formatMessage({id: 'query.result.cost.text',})
              + ` ${resultTimeCost[activeQueryTabkey]} ms`}
              <Divider type="vertical" />
            {intl.formatMessage({id: 'query.result.return.text',})
              + ` ${resultSize[activeQueryTabkey]} `
              + intl.formatMessage({id: 'query.result.return.rows',})}
              <Divider type="vertical" />
            {intl.formatMessage({id: 'query.result.load.done',})}
          </span>
          {resultLocator}
          </>
        );
      }
      setResultMessage({...resultMessageRef.current});
      for(let j=0;j<data.length;j++){
        Object.keys(data[j]).map((item,index)=>{
          if(resultColumnRef.current[activeQueryTabkey][item]==null){
            let temp = {title:
              item, editable: true
              , dataIndex: item, width: 200
              , key: item,render: val => {
              return val;}
            };
            resultColumnRef.current[activeQueryTabkey][item] = temp;
            resultColumnRef.current[activeQueryTabkey][resultColumnRef.current[activeQueryTabkey].length]=temp;
          }
        })
        data[j].index = l+j+1;
        resultDataRef.current[activeQueryTabkey][l+j]=data[j];
      }
        resultDataRef.current[activeQueryTabkey] = resultDataRef.current[activeQueryTabkey].slice();
        setResultColumn({...resultColumnRef.current});
        setResultData({...resultDataRef.current});
    }else if(ret.message != null){
      resultMessageRef.current[activeQueryTabkey]=(
        <>
        <span >
          {`${activeQueryTabkey} ` +
            intl.formatMessage({id: 'query.result.cost.text',})
            + ` ${resultTimeCost[activeQueryTabkey]} ms`}
            <Divider type="vertical" />
          {intl.formatMessage({id: 'query.result.return.text',})
            + ` ${resultSize[activeQueryTabkey]} `
            + intl.formatMessage({id: 'query.result.return.rows',})}
            <Divider type="vertical" />
          {`${ret.message}`}
        </span>
        {resultLocator}
        </>
      );
      setResultMessage({...resultMessageRef.current});
    }
  }
  const closeQueryTab = (e2,l) =>{
    e2.preventDefault();
    let temp2 = queryTabList;
    for(let i=0;i<temp2.length;i++){
      if(temp2[i]!=null&&temp2[i].key==('query'+l)){
        temp2[i]=null;
        break;
      }
    }
    temp2 = temp2.filter(item => item != null);
    setQueryTabList(temp2);
    clearEditable();
    setActiveQueryTabkey('queryPlus');
    onOperationTabChange('Plus');
    setReadOnly(true);
  }
  let queryTabIndex = 1;
  const [queryTabList, setQueryTabList] = useState([
    {
      key: 'query1',
      tab:
        <span onClick={
          ()=>{
            setActiveQueryTabkey('query1');
            onOperationTabChange(1);
            clearEditable();
          }
        }
        >{intl.formatMessage({id: 'query.query.text',})+'1'}</span>
    },
    {
      key: 'queryPlus',
      tab: <PlusCircleOutlined onClick={
        (e,v)=>{
          if(queryTabIndex==100){
            alert(intl.formatMessage({id: 'query.query.rule',}));
            return;
          }
          queryTabIndex+=1;
          let temp = queryTabList;
          const l = queryTabList.length;
          temp[l] = temp[l-1];
          temp[l-1] = {
            key: 'query'+queryTabIndex,
            tab: <><span onClick={
                ()=>{
                  setActiveQueryTabkey('query'+(l));
                  onOperationTabChange(l);
                  clearEditable();
                }
              }
              >{intl.formatMessage({id: 'query.query.text',})+queryTabIndex} </span>
              <Popconfirm title="Sure to delete?" onConfirm={(e2) => {closeQueryTab(e2,l);}}>
                <CloseCircleOutlined
                style={{cursor: 'default'}} title='delete'  />
              </Popconfirm>
            </>,
          };
          temp = temp.filter(item => item != null);
          setQueryTabList(temp);
          setActiveQueryTabkey('query'+(l));
          onOperationTabChange(l);
        }
      }/>,
    },
  ]);
  const ButtonGroup = Button.Group;
  const alertQueryTab = () => {
    if(activeQueryTabkey=='queryPlus' || readOnly){
      alert(intl.formatMessage({id: 'query.query.description',}));
      return true;
    }
    return false;
  }
  const clearEditable = () => {
    let t = {};
    Object.keys(editableForm.getFieldsValue()).map((item,index)=>{
        t[item]=null;
    })
    editableForm.setFieldsValue({...t});
    setEditingKey('');
  }
  const runQuery = async() => {
    clearEditable();
    if(alertQueryTab()){ return; };
    resultGraphicalColumn[activeQueryTabkey]=null;
    setResultGraphicalColumn({...resultGraphicalColumn});
    resultMessage[activeQueryTabkey]=null;
    setResultMessage({...resultMessage});
    resultColumn[activeQueryTabkey]=[];
    setResultColumn({...resultColumn});
    resultData[activeQueryTabkey]=[];
    setResultData({...resultData});
    if(queryToken[activeQueryTabkey] == null){
      let token = uuid().replaceAll('-','');
      queryToken[activeQueryTabkey]=token;
      setQueryToken({...queryToken});
    }
    let sql = querySql[activeQueryTabkeyRef.current];
    querySql[activeQueryTabkeyRef.current]=querySql[activeQueryTabkeyRef.current];
    let tabToken = uuid().replaceAll('-','');
    queryTabTokens[activeQueryTabkeyRef.current] = tabToken;
    setQueryTabTokens({...queryTabTokens});
    let ret = await querySqlWithTenantUsingPOST({
      sqls: sql, queryToken: queryToken[activeQueryTabkey],
      tabKey: activeQueryTabkeyRef.current, tabToken: tabToken,
      umi_locale: localStorage.getItem("umi_locale")});
    if(ret.code == '0'){
      let messageJson = JSON.parse(ret.message || '{}');
      if(messageJson.tabToken != queryTabTokensRef.current[messageJson.tabKey]){
        notification.error({
          message: intl.formatMessage({id: 'query.result.expired',}),
        });
        return;
      }
      let data = ret.data == null ? [] : ret.data;
      resultTimeCost[activeQueryTabkey]=messageJson.costMilliSecond == null?0:messageJson.costMilliSecond;
      setResultTimeCost({...resultTimeCost});
      resultSize[activeQueryTabkey]=(data.length);
      setResultSize(resultSize);
      if(messageJson.hasMore){
        resultMessage[activeQueryTabkey]=(
          <>
          <span>
            {`${activeQueryTabkey} ` +
              intl.formatMessage({id: 'query.result.cost.text',})
              + ` ${resultTimeCost[activeQueryTabkey]} ms`}
              <Divider type="vertical" />
            {intl.formatMessage({id: 'query.result.return.text',})
              + ` ${resultSize[activeQueryTabkey]} `
              + intl.formatMessage({id: 'query.result.return.rows',})}
              <Divider type="vertical" />
          </span>
          <a onClick={() => {queryAppend()}}>{intl.formatMessage({id: 'query.result.load.next',})}</a>
          {resultLocator}
          </>
        );
      }else{
        resultMessage[activeQueryTabkey]=(
          <>
          <span >
            {`${activeQueryTabkey} ` +
              intl.formatMessage({id: 'query.result.cost.text',})
              + ` ${resultTimeCost[activeQueryTabkey]} ms`}
              <Divider type="vertical" />
            {intl.formatMessage({id: 'query.result.return.text',})
              + ` ${resultSize[activeQueryTabkey]} `
              + intl.formatMessage({id: 'query.result.return.rows',})}
              <Divider type="vertical" />
            {`${data.length==0?intl.formatMessage({id: 'query.result.execute.done',}):
              intl.formatMessage({id: 'query.result.load.done',})}`}
          </span>
          <span >
          {resultLocator}
          </span >
          </>
        );
      }
      setResultMessage({...resultMessage});
      if(data.length == 0){
        resultColumn[activeQueryTabkey]=[];
        setResultColumn({...resultColumn});
        resultData[activeQueryTabkey]=[];
        setResultData({...resultData});
      }else{
        let columnObj = [];
        for(let i=0;i<data.length;i++){
          if(columnObj['index']==null){
            columnObj['index'] = {title: 'index'
              , editable: false
              , dataIndex: 'index', width:70
              , key: 'index',
              fixed: 'left',
            };
            columnObj[columnObj.length]=columnObj['index'];
          }
          Object.keys(data[i]).map((item,index)=>{
            if(columnObj[item]==null){
              columnObj[item] = {
                title:(item=='Time'||item=='Device')? item:
                <>{item} <span title='Check to graph this column'><LineChartOutlined
                checked={false}
                onClick={(e)=>{
                  let v = item;
                  resultGraphicalColumnRef.current[activeQueryTabkey]=v;
                  setResultGraphicalColumn({...resultGraphicalColumnRef.current});
                }}
                /></span></>
                , editable:(item=='Time'||item=='Device')? false: true
                , dataIndex: item, width:190
                , key: item,
                fixed: (item=='Time'||item=='Device')?'left':false,
              };
              columnObj[columnObj.length]=columnObj[item];
            }
          })
          data[i].index = i+1;
        }
        resultColumn[activeQueryTabkey]=columnObj;
        setResultColumn({...resultColumn});
        resultData[activeQueryTabkey]=data.slice();
        setResultData({...resultData});
      }
    }else{
      resultMessage[activeQueryTabkey]=activeQueryTabkey + ' ' +
        intl.formatMessage({id: 'query.result.execute.failed',});
      setResultMessage({...resultMessage});
      notification.error({
        message: ret.message,
      });
    }
  }

  const showSaveQueryModal = () => {
    if(alertQueryTab()){ return; };
    setAddQueryVisible(true);
  }

  const formatQuery = () => {
    let formatted = sqlFormat(querySql[activeQueryTabkey]);
    querySql[activeQueryTabkey]="";
    setQuerySql({...querySql});
    querySql[activeQueryTabkey]=formatted;
    setQuerySql({...querySql});
  }

  const updatePoint = async(timestamp, point, value) => {
    if(alertQueryTab()){ return; };
    let ret = await updatePointWithTenantUsingPOST({
      point: point, value: value,
      timestamp: timestamp,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    return ret;
  }

  const showSqlModal = async() => {
    if(alertQueryTab()){ return; };
    let ret = await queryAllUsingPOST({
      pageSize:10, pageNum: 1,
      umi_locale: localStorage.getItem("umi_locale"),
    });
    CommonUtil.dealCallback(ret, (ret_)=>{
      let index = 0;
      ret_.data.pageItems.map((item)=>{item['key']=index++;});
      setSqlModalContent(ret_.data);
      setSqlModalVisible(true);
    }, notification);
  }
  const exportCsv = (o) => {
    if(o.queryCommand==null || o.queryCommand.trim()==''){
      notification.error({
        message: intl.formatMessage({id: 'query.sql.export.required',}),
      });
      return;
    }
    let url = '/api/query/exportCsv?sqls='+o.queryCommand+'&timeformat='+o.timeformat+'&timeZone='
      +o.timeZone+'&compress='+o.compress+'&targetFile='+(o.targetFile==null?'dump':o.targetFile
      )+'&umi_locale='+localStorage.getItem("umi_locale");
    CommonUtil.download2(url);
  }
  const action = (
    <RouteContext.Consumer>
      {({ isMobile }) => {
        if (isMobile) {
          return (
            <Fragment>
              <ButtonGroup>
                <Button onClick={showSaveQueryModal}><SaveOutlined />
                  {intl.formatMessage({id: 'query.sql.script.save',})}
                </Button>
                <Button onClick={showSqlModal}><FileSearchOutlined />
                  {intl.formatMessage({id: 'query.sql.script.view',})}
                </Button>
                <Button onClick={runQuery} type="primary"><PlayCircleOutlined />
                  {intl.formatMessage({id: 'query.sql.execute',})}
                </Button>
              </ButtonGroup>
            </Fragment>
          );
        }
        return (
          <Fragment >
            <Tooltip title={<span>
              {intl.formatMessage({id: 'query.sql.tooltip1',})}<br/>
              {intl.formatMessage({id: 'query.sql.tooltip2',})}<br/>
              {intl.formatMessage({id: 'query.sql.tooltip3',})}<br/>
              {intl.formatMessage({id: 'query.sql.tooltip4',})}
            </span>}>
              <QuestionCircleOutlined />
            </Tooltip>
            <span> </span>
            <ButtonGroup>
              <Button onClick={runQuery} type="primary"><PlayCircleOutlined />
                {intl.formatMessage({id: 'query.sql.execute',})}
              </Button>
              <Button onClick={showSaveQueryModal}><FileSearchOutlined />
                {intl.formatMessage({id: 'query.sql.script.save',})}
              </Button>
              <Dropdown.Button
                trigger={['hover']}
                onClick={showSqlModal}
                icon={<EllipsisOutlined />}
                overlay={
                <Menu>
                  <Menu.Item key="exportCsv" onClick={() => {
                    setExportModalVisible(true);
                  }} ><ExportOutlined /> {intl.formatMessage({id: 'query.sql.export',})}</Menu.Item>
                  <Menu.Item key="importCsv" onClick={() => {
                    setImportModalVisible(true);
                  }} ><ImportOutlined /> {intl.formatMessage({id: 'query.sql.import',})}</Menu.Item>
                </Menu>}
                placement="bottomRight"
              >
                <SaveOutlined />{intl.formatMessage({id: 'query.sql.script.view',})}
              </Dropdown.Button>
            </ButtonGroup>
          </Fragment>
        );
      }}
    </RouteContext.Consumer>
  );
  const { loading } = {};
  contentList = {
    'queryPlus':(
      <Table
        pagination={false}
        loading={loading}
        dataSource={[]}
        columns={[]}
        scroll={{ y: 450, scrollToFirstRowOnChange: false }}
        sticky={false}
        components={VList({
          height: 450,
        })}
      />
    )
  };
  for(let i=1;i<100;i++){
    contentList['query'+i]=(
    <>
      <VisualMiniArea line
       data={resultData['query'+i]} name={resultGraphicalColumn['query'+i]}
       activeQueryTabkey={activeQueryTabkey}
       resultGraphicalColumn={resultGraphicalColumn}
       setResultGraphicalColumn={setResultGraphicalColumn}
      />
      <EditableTable
        rowKey='index'
        loading={loading}
        columns={resultColumn['query'+i]==null?[]:resultColumn['query'+i]}
        scroll={{ y: 450, scrollToFirstRowOnChange: false }}
        sticky={false}
        pagination={false}
        data={resultData}
        setData={setResultData}
        active={'query'+i}
        editingKey={editingKey}
        setEditingKey={setEditingKey}
        form={editableForm}
        clearEditable={clearEditable}
        updatePoint={updatePoint}
        wrapTableRef={wrapTableRef}
        timeDisplayForm={timeDisplayForm}
      />
    </>
    );
  }

  const onOperationTabChange = (key) => {
    setReadOnly(false);
    setTabStatus({ tabActiveKey: 'tab'+key, operationKey: 'query'+key });

  };

  return (
    <PageContainer
      title={initialState.activeConnectionDesc}
      extra={action}
      className={styles.pageHeader}
      content={codeMirror}
      tabList={queryTabList}
      tabActiveKey={activeQueryTabkey}
    >

      <div className={styles.main}>

        <GridContent>
          <Card
            className={styles.tabsCard}
            title={
              resultMessage[activeQueryTabkey]
            }
            bordered={false}
          >
            {contentList[tabStatus.operationKey]}
          </Card>
        </GridContent>
      </div>
      <OperationModal
        visible={sqlModalVisible}
        setVisible={setSqlModalVisible}
        content={sqlModalContent}
        setContent={setSqlModalContent}
        querySql={querySql}
        setQuerySql={setQuerySql}
        activeQueryTabkey={activeQueryTabkey}
      />
      <AddQueryModal
        visible={addQueryVisible}
        setVisible={setAddQueryVisible}
        querySql={querySql}
        activeQueryTabkey={activeQueryTabkey}
      />
      <ExportModal
        visible={exportModalVisible}
        setVisible={setExportModalVisible}
        exportCsv={exportCsv}
        activeQueryTabkey={activeQueryTabkey}
      />
      <ImportModal
        destroyOnClose={true}
        visible={importModalVisible}
        setVisible={setImportModalVisible}
        activeQueryTabkey={activeQueryTabkey}
      />
    </PageContainer>
  );
};

export default Self;
