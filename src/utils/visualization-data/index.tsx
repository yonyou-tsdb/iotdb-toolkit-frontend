import Charts from 'ant-design-pro/lib/Charts';
const {MiniArea, MiniBar, MiniProgress} = Charts;
import moment from 'moment';
const BuildVisualizationData = (props) => {

}

export const VisualMiniArea = (props: {}) => {
  const { data, line } = props;
  // alert(line)
  const visitData = [{x:moment(parseInt(0)).utc().format('YYYY-MM-DD HH:mm:ss.SSS'),y:0}];
  const beginDay = new Date().getTime();
  const limit = 1000;
  if(data!=null && data.length>0){
    if (data.length < 1000){
      for (let i = 0; i < data.length; i++) {
        let b = true;
        Object.keys(data[i]).map((item,index)=>{
          if(b && item!='index' && item!= 'Time'){
            b = false;
            visitData.push({
              x: moment(parseInt(data[i]['Time'])).utc().format('YYYY-MM-DD HH:mm:ss.SSS'),
              y: data[i][item],
            });
          }
          return;
        })
      }
    }else
    {
      let segment = limit / data.length;
      let totalSegment = 0.0;
      for (let i = 0; i < data.length; i++) {
        totalSegment += segment;
        let b = true;
        if(totalSegment >= 1){
          totalSegment -= 1;
          Object.keys(data[i]).map((item,index)=>{
            if(b && item!='index' && item!= 'Time'){
              b = false;
              visitData.push({
                x: moment(parseInt(data[i]['Time'])).utc().format('YYYY-MM-DD HH:mm:ss.SSS'),
                y: data[i][item],
              });
            }
            return;
          })
        }
      }
    }
  }
  return <MiniArea line={line} data={visitData} />;
}

export const VisualMiniBar = (props: {}) => {
  const { data, line } = props;
  return <MiniBar line data={data} />;
}
