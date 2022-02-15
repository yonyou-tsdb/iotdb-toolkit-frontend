function getItem(key) {
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}
function addItem(key, value, path){
  if(path == null){
    document.cookie = key + "=" + value;
  }else{
    document.cookie = key + "=" + value + "; path=" + path;
  }
}
export default {
  getItem, addItem,
};
