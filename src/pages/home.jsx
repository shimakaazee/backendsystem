import { Card, Col, Row, Drawer, List, Avatar } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash';

const { Meta } = Card;
const home = () => {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [dataList, setdataList] = useState([]);
  const [current, setcurrent] = useState(null);
  const [visible, setvisible] = useState(false);
  const barRef = useRef();
  const pieRef = useRef();
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios
      .get(
        'http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6',
      )
      .then((res) => {
        setviewList(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        'http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6',
      )
      .then((res) => {
        setstarList(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get('http://localhost:5000/news?publishState=2&_expand=category')
      .then((res) => {
        // console.log(res.data)
        setdataList(res.data);
        ech(_.groupBy(res.data, (item) => item.category.title));
      });
    return () => {
      window.onresize = null;
    };
  }, []);
  const pie = () => {
    const currentlist = dataList.filter((item) => item.author === username);
    const groupOBJ = _.groupBy(currentlist, (item) => item.category.title);
    const renderlist = [];
    for (var i in groupOBJ) {
      renderlist.push({
        value: groupOBJ[i].length,
        name: i,
      });
    }
    var myChart;
    if (!current) {
      myChart = echarts.init(pieRef.current);
      setcurrent(myChart);
    } else {
      myChart = current;
    }

    var option;

    option = {
      title: {
        text: '用户新闻分类图示',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: renderlist,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);
  };
  const ech = (obj) => {
    var myChart = echarts.init(barRef.current);
    // var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '分类图示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: 45,
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  };
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setTimeout(() => {
                    setvisible(true);
                    pie();
                  }, 0);
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <span>{region ? region : '全球'}</span>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        title="个人新闻分类"
        placement="right"
        onClose={() => {
          setvisible(false);
        }}
        visible={visible}
        closable={true}
        width="600px"
      >
        <div
          ref={pieRef}
          style={{ height: '400px', width: '100%', marginTop: '30px' }}
        ></div>
      </Drawer>
      <div
        ref={barRef}
        style={{ height: '400px', width: '100%', marginTop: '30px' }}
      ></div>
    </div>
  );
};
home.wrappers = ['@/wrappers/Auth'];
export default home;
