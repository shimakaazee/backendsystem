import { Card, Col, Row, List } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useState } from 'react';

const news = () => {
  const [list, setlist] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:5000/news?publishState=2&_expand=category')
      .then((res) => {
        setlist(
          Object.entries(_.groupBy(res.data, (item) => item.category.title)),
        );
      });
  }, []);
  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      className="site-page-header" title="新闻浏览" subTitle="查看"
      <div className="site-card-wrapper" style={{ marginTop: '30px' }}>
        <Row gutter={[16, 16]}>
          {list.map((item) => {
            // console.log(item)
            return (
              <Col span={8} key={item[0]}>
                <Card title={item[0]} bordered={true} hoverable={true}>
                  <List
                    size="small"
                    dataSource={item[1]}
                    pagination={{
                      pageSize: 2,
                    }}
                    renderItem={(data) => (
                      <List.Item>
                        <a href={`/detail/${data.id}`}>{data.title}</a>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};
export default news;
