function dealCallback(ret, callback, notification_){
  if(notification_!= null && (ret == null || ret.code != '0')){
    notification_.error({
      message: ret.message,
    });
  }else{
    callback(ret);
  }
}
function download(ret, name){
  let blob = URL.createObjectURL(new Blob([ret]));
  const aLink=document.createElement('a');
  aLink.style.display='none';
  aLink.href=blob;
  aLink.download=name;
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
}
function download2(href){
  const aLink=document.createElement('a');
  aLink.style.display='none';
  aLink.href=href;
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
}
export default {
  dealCallback, download, download2,
};
