// import Charts from 'ant-design-pro1/lib/Charts';
import {ChartCard, MiniArea, MiniBar, MiniProgress, Bar}
 from '../../../node_modules/ant-design-pro/lib/Charts';
import { Line } from '@ant-design/charts';
import NumberInfo from '../../../node_modules/ant-design-pro/lib/NumberInfo';
import {CloseCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
const BuildVisualizationData = (props) => {

}

export const VisualMiniArea = (props: {}) => {
  const { name, data, line, resultGraphicalColumn, setResultGraphicalColumn,
    activeQueryTabkey } = props;
  const visitData = [];
  const beginDay = new Date().getTime();
  const limit = 1000;
  if(data!=null && data.length>0 && name != null){
    let segment = limit / data.length;
    let totalSegment = 0.0;
    for (let i = 0; i < data.length; i++) {
      totalSegment += segment;
      if(totalSegment >= 1){
        totalSegment -= 1;
        Object.keys(data[i]).map((item,index)=>{
          if(item == name){
            visitData.push({
              date: parseInt(data[i]['Time']),
              value: parseFloat(data[i][name]),
              type: name,
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
      position: 'top',
    },
    seriesField: 'type',
    responsive: true,
    style: {
      height: 200,
    }
  };
  return <ChartCard title={<><b>{name}</b> <CloseCircleOutlined
  style={{cursor: 'pointer'}} title='close' onClick={()=>{
    resultGraphicalColumn[activeQueryTabkey]=null;
    setResultGraphicalColumn({...resultGraphicalColumn});
  }} /></>} contentHeight={250} >
  <NumberInfo subTitle={<>total : {data.length}  sampling : {visitData.length}</>} />
  <Line {...config2} />
  </ChartCard>;
  }else{
    return null;
  }
}

export const VisualMiniBar = (props: {}) => {
  const { data, line } = props;
  return <MiniBar line data={data} />;
}
