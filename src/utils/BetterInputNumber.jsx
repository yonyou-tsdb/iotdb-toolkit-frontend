import React from 'react';
import { InputNumber } from 'antd';

export class BetterInputNumber extends React.Component {
  render() {
    if (this.props.addonAfter) {
      return (
        <>
          <InputNumber style={{borderBottomRightRadius:0, borderTopRightRadius:0, width: 170, size: "small"}} {...this.props}/>
          <div className="ant-input-group-addon" style={{marginTop:'-4px', paddingTop:'2px', display:'inline-table', lineHeight:'24px', height:'32px'}}>{this.props.addonAfter}</div>
        </>
      );
    } else {
      return (
          <InputNumber {...this.props}/>
      );
    }
  }
}
