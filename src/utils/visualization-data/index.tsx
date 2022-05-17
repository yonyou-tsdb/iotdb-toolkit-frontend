// import Charts from 'ant-design-pro1/lib/Charts';
import Charts from '../../../node_modules/ant-design-pro1/lib/Charts';
const {ChartCard, MiniArea, MiniBar, MiniProgress, Bar} = Charts;
import NumberInfo from '../../../node_modules/ant-design-pro1/lib/NumberInfo';
import {CloseCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
const BuildVisualizationData = (props) => {

}

export const VisualMiniArea = (props: {}) => {
  const { name, data, line, resultGraphicalColumn, setResultGraphicalColumn,
    activeQueryTabkey } = props;
  const visitData = [{x:moment(parseInt(0)).utc().format('YYYY-MM-DD HH:mm:ss.SSS'),y:0}];
  const beginDay = new Date().getTime();
  const limit = 1000;
  if(data!=null && data.length>0 && name != null){
    let segment = limit / data.length;
    let totalSegment = 0.0;
    for (let i = 0; i < data.length; i++) {
      totalSegment += segment;
      let b = true;
      if(totalSegment >= 1){
        totalSegment -= 1;
        Object.keys(data[i]).map((item,index)=>{
          if(b){
            b = false;
            visitData.push({
              x: moment(parseInt(data[i]['Time'])).utc().format('YYYY-MM-DD HH:mm:ss.SSS'),
              y: data[i][name],
            });
          }
          return;
        })
      }
    }

  return <ChartCard title={<><b>{name}</b> <CloseCircleOutlined
  style={{cursor: 'pointer'}} title='close' onClick={()=>{
    resultGraphicalColumn[activeQueryTabkey]=null;
    setResultGraphicalColumn({...resultGraphicalColumn});
  }} /></>} contentHeight={250} >
  <NumberInfo subTitle={<>total : {data.length}  sampling : {visitData.length-1}</>} />
  <MiniArea line={line} data={visitData} height={200}  yAxis= {{
      grid: {
        line: {
          style: {
            stroke: '#000a3b',
          },
        },
      },
    }}/></ChartCard>;
  }else{
    return null;
  }
}

export const VisualMiniBar = (props: {}) => {
  const { data, line } = props;
  return <MiniBar line data={data} />;
}
