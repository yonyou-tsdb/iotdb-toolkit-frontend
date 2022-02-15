function getStringFromMillisecond(millisecond) {
  let sec = Math.floor(millisecond / 1000);
  const nyear = Math.floor(sec / 31536000);
  sec = sec - nyear * 31536000;
  const nday = Math.floor(sec / 86400);
  sec = sec - nday * 86400;
  const nhour = Math.floor(sec / 3600);
  sec = sec - nhour * 3600;
  const nminute = Math.floor(sec / 60);
  sec = sec - nminute * 60;
  let ret = '';
  if(sec > 0){
    ret = sec + ' s';
  }
  if(nminute > 0){
    ret = nminute + ' m ' + ret;
  }
  if(nhour > 0){
    ret = nhour + ' h ' + ret;
  }
  if(nday > 0){
    ret = nday + ' d ' + ret;
  }
  if(nyear > 0){
    ret = nyear + ' y ' + ret;
  }
  return ret;
}
function getMillisecondFromTimeunit(num, timeunit){
  if(num == null || timeunit == null){
    return null;
  }
  if(timeunit == 'y'){
    return num * 31536000000;
  }
  if(timeunit == 'd'){
    return num * 86400000;
  }
  if(timeunit == 'h'){
    return num * 3600000;
  }
  if(timeunit == 'm'){
    return num * 60000;
  }
  if(timeunit == 's'){
    return num * 1000;
  }
  return null;
}
export default {
  getStringFromMillisecond, getMillisecondFromTimeunit,
};
