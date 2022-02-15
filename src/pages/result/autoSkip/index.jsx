import React, { Component } from 'react';
import queryString from 'query-string';
import { history } from 'umi';
import { parse, stringify } from 'qs';
const { query = {}, pathname } = history.location;
export default class GlobalError extends Component {
  componentDidMount() {
    let locationStr = location.toString();
    let self = locationStr.substring(locationStr.indexOf('#') + 1,locationStr.length);
    let query = this.props.location.query || queryString.parse(this.props.location.search);
    if(query.skipTo!=null && query.skipTo!==self){
      if(query.skipTo.includes('?')){
        let skipTo = query.skipTo.split('?')[0];
        let params = parse(query.skipTo.split('?')[1]);
        history.push({
          pathname: skipTo,
          search: stringify(params)
        });
      } else {
        history.push({
          pathname: query.skipTo,
        });
      }
    }
  }
  render() {
    return null;
  }
}
