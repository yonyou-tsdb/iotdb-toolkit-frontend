import {Badge, Button, Card, Statistic, Descriptions, Divider, } from 'antd';
import {ChartCard, MiniArea, MiniBar, MiniProgress, Bar}
 from '../../../node_modules/ant-design-pro/lib/Charts';
import { Line } from '@ant-design/charts';
import NumberInfo from '../../../node_modules/ant-design-pro/lib/NumberInfo';
import {CloseCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
const BuildVisualizationData = (props) => {

}

export const VisualMiniArea = (props: {}) => {
  const { names, data, line, resultGraphicalColumn, setResultGraphicalColumn,
    activeQueryTabkey } = props;
  const visitData = [];
  const beginDay = new Date().getTime();
  const limit = 1000;
  if(data!=null && data.length>0 && names != null && names.length>0){
    let segment = limit / data.length;
    let totalSegment = 0.0;
    for (let i = 0; i < data.length; i++) {
      totalSegment += segment;
      if(totalSegment >= 1){
        totalSegment -= 1;
        Object.keys(data[i]).map((item,index)=>{
          if(names.indexOf(item)>=0){
            visitData.push({
              date: parseInt(data[i]['Time']),
              value: parseFloat(data[i][item]),
              type: item,
            });
          }
          return;
        })
      }
    }
  const config2 = {
    data: visitData,
    padding: 'auto',
    forceFit: true,
    xField: 'date',
    yField: 'value',
    xAxis: {
      label: {
        formatter: (v) => moment(parseInt(v)).utc().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
    },
    legend: {
      position: 'bottom',
    },
    seriesField: 'type',
    responsive: true,
    style: {
      height: 200,
    }
  };
  return <>
  <NumberInfo subTitle={<>

  {names.map((name) => (<span key={name}><span > {name} </span>
    <span>
    <CloseCircleOutlined
      style={{cursor: 'pointer'}} title={`remove '${name}' from graph`} onClick={()=>{
        let i = resultGraphicalColumn[activeQueryTabkey].indexOf(name);
        if(i>=0){
          resultGraphicalColumn[activeQueryTabkey].splice(i,1);
          setResultGraphicalColumn({...resultGraphicalColumn});
        }
      }} /> </span><Divider type="vertical" /></span>))}
    <br/>total : {data.length}
    <Divider type="vertical" />
    sampling : {Math.min(data.length,1000)}
    </>} />
  <Line {...config2} />
  </>;
  }else{
    return null;
  }
}

export const VisualMiniBar = (props: {}) => {
  const { data, line } = props;
  return <MiniBar line data={data} />;
}
