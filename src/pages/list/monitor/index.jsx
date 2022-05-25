import {
  DingdingOutlined, DownOutlined, EllipsisOutlined, InfoCircleOutlined,
  AppstoreAddOutlined, SaveOutlined, SettingOutlined, LeftOutlined, RightOutlined,
  ClockCircleOutlined, ZoomOutOutlined, ReloadOutlined, StarOutlined,
  StarFilled, StarTwoTone,
} from '@ant-design/icons';
import {
  Badge, Button, Card, Statistic, Descriptions, Divider, Dropdown, Menu, Popover,
  Steps, Table, Tooltip, Empty, Row, Col,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { useRequest } from 'umi';
import { Line } from '@ant-design/charts';
import styles from './style.less';
const { Step } = Steps;
const ButtonGroup = Button.Group;
const menu = (
  <Menu>
    <Menu.Item key="1">Off</Menu.Item>
    <Menu.Item key="2">15s</Menu.Item>
    <Menu.Item key="3">30s</Menu.Item>
    <Menu.Item key="4">1m</Menu.Item>
    <Menu.Item key="5">5m</Menu.Item>
    <Menu.Item key="6">15m</Menu.Item>
    <Menu.Item key="7">30m</Menu.Item>
  </Menu>
);
const offlineChartData1 = [];
const offlineChartData2 = [];
const offlineChartData3 = [];
const offlineChartData4 = [];
const offlineChartData5 = [];
const offlineChartData6 = [];
for(let i=0;i<500;i++){
  if(i%2==0){
    offlineChartData1.push({
      date: i,
      value: Math.random() * 500,
      type: "asd",
    });
  }
  if(i%2==1){
    offlineChartData1.push({
      date: i,
      value: Math.random() * 500,
      type: "qwe",
    });
  }
  if(i%4==0){
    offlineChartData2.push({
      date: i,
      value: Math.random() * 30000,
      type: "asd",
    });
  }
  if(i%4==1){
    offlineChartData2.push({
      date: i,
      value: Math.random() * 30000,
      type: "qwe",
    });
  }
  if(i%6==0){
    offlineChartData3.push({
      date: i,
      value: Math.random() * 20000,
      type: "asd",
    });
  }
  if(i%6==1){
    offlineChartData3.push({
      date: i,
      value: Math.random() * 20000,
      type: "qwe",
    });
  }
  if(i%8==0){
    offlineChartData4.push({
      date: i,
      value: Math.random() * 1000,
      type: "asd",
    });
  }
  if(i%8==1){
    offlineChartData4.push({
      date: i,
      value: Math.random() * 1000,
      type: "qwe",
    });
  }
  if(i%10==0){
    offlineChartData5.push({
      date: i,
      value: Math.random() * 20,
      type: "asd",
    });
  }
  if(i%10==1){
    offlineChartData5.push({
      date: i,
      value: Math.random() * 20,
      type: "qwe",
    });
  }
}
const config1 = {
  data: offlineChartData1,
  padding: 'auto',
  forceFit: true,
  xField: 'date',
  yField: 'value',
  yAxis: {
    label: {
      formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    },
  },
  legend: {
    position: 'right-top',
  },
  seriesField: 'type',
  responsive: true,
  style: {
    height: 180,
  }
};
const config2 = {
  data: offlineChartData2,
  padding: 'auto',
  forceFit: true,
  xField: 'date',
  yField: 'value',
  yAxis: {
    label: {
      formatter: (v) => `${v} point`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    },
  },
  legend: {
    position: 'right-top',
  },
  seriesField: 'type',
  responsive: true,
  style: {
    height: 180,
  }
};
const config3 = {
  data: offlineChartData3,
  padding: 'auto',
  forceFit: true,
  xField: 'date',
  yField: 'value',
  yAxis: {
    label: {
      formatter: (v) => `${v} MB`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    },
  },
  legend: {
    position: 'right-top',
  },
  seriesField: 'type',
  responsive: true,
  style: {
    height: 180,
  }
};
const config4 = {
  data: offlineChartData4,
  padding: 'auto',
  forceFit: true,
  xField: 'date',
  yField: 'value',
  yAxis: {
    label: {
      formatter: (v) => `${v} q/s`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    },
  },
  legend: {
    position: 'right-top',
  },
  seriesField: 'type',
  responsive: true,
  style: {
    height: 180,
  }
};
const config5 = {
  data: offlineChartData5,
  padding: 'auto',
  forceFit: true,
  xField: 'date',
  yField: 'value',
  yAxis: {
    label: {
      formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    },
  },
  legend: {
    position: 'right-top',
  },
  seriesField: 'type',
  responsive: true,
  style: {
    height: 180,
  }
};
const action = (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      return (
        <Fragment>
          <Button title='新增面板'><AppstoreAddOutlined /></Button>
          <span> </span>
          <Button title='保存仪表板'><SaveOutlined /></Button>
          <span> </span>
          <Button title='设置仪表板'><SettingOutlined /></Button>
          <span> </span>
          <ButtonGroup>
            <Button><LeftOutlined /></Button>
            <Button type="primary"><ClockCircleOutlined />2022-03-21 20:53:56 至 2022-07-27 20:53:56</Button>
            <Button><RightOutlined /></Button>
            <Button><ZoomOutOutlined /></Button>
          </ButtonGroup>
          <span> </span>
          <ButtonGroup>
            <Button title='刷新仪表板'><ReloadOutlined /></Button>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button>
                <DownOutlined />
              </Button>
            </Dropdown>
          </ButtonGroup>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);

const Advanced = () => {
  return (
    <PageContainer
      title=<span>仪表板名 <StarTwoTone twoToneColor="#FC4C2F"
       style={{cursor: 'pointer'}} /></span>
      extra={action}
      className={styles.pageHeader}
      content={null}
      extraContent={null}
    >

    <Row gutter={8}>
      <Col span={12}>
      <Card
        title="entity数量 / 172.20.45.128:6667"
        style={{
          marginBottom: 5,
        }}
        bordered={false}
      >
        <Line {...config1} />
      </Card>
      </Col>
      <Col span={12}>
      <Card
        title="每分钟写点数量 / 127.0.0.1:6667"
        style={{
          marginBottom: 5,
        }}
        bordered={false}
      >
        <Line {...config2} />
      </Card>
      </Col>
    </Row>
    <Row gutter={8}>
      <Col span={12}>
      <Card
        title="storage group占用内存 / 172.20.45.128:6667"
        style={{
          marginBottom: 5,
        }}
        bordered={false}
      >
        <Line {...config3} />
      </Card>
      </Col>
      <Col span={12}>
      <Card
        title="QPS / 127.0.0.1:6667"
        style={{
          marginBottom: 5,
        }}
        bordered={false}
      >
        <Line {...config4} />
      </Card>
      </Col>
    </Row>
    <Row gutter={8}>
      <Col span={12}>
      <Card
        title="GC次数 / 172.20.45.128：6667"
        style={{
          marginBottom: 5,
        }}
        bordered={false}
      >
        <Line {...config5} />
      </Card>
      </Col>
    </Row>
    </PageContainer>
  );
};

export default Advanced;
