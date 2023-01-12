import { useParams } from 'umi';
import { Descriptions } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';

const id = () => {
  const [newsinfo, setnewsinfo] = useState();
  const params = useParams();
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/news/${params.id}?_expand=category&_expand=role`,
      )
      .then((res) => {
        setnewsinfo(res.data);
      });
  }, [params.id]);
  const auditList = ['未审核', '审核中', '已通过', '未通过'];
  const publishList = ['未发布', '待发布', '已上线', '已下线'];
  const colorList = ['gray', 'orange', 'green', 'red'];

  return (
    <div>
      {newsinfo && (
        <div>
          onBack={() => window.history.back()}
          title={newsinfo.title}
          subTitle={newsinfo.category.title}
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">
              {newsinfo.author}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(newsinfo.createTime).format('YYYY/MM/DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {newsinfo.publishTime
                ? moment(newsinfo.publishTime).format('YYYY/MM/DD HH:mm:ss')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="区域">
              {newsinfo.region}
            </Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <span style={{ color: colorList[newsinfo.auditState] }}>
                {auditList[newsinfo.auditState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="发布状态">
              <span style={{ color: colorList[newsinfo.publishState] }}>
                {publishList[newsinfo.publishState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="访问数量">
              <span style={{ color: 'green' }}>{newsinfo.view}</span>
            </Descriptions.Item>
            <Descriptions.Item label="点赞数量">
              <span style={{ color: 'green' }}>{newsinfo.star}</span>
            </Descriptions.Item>
            <Descriptions.Item label="评论数量">
              <span style={{ color: 'green' }}>0</span>
            </Descriptions.Item>
          </Descriptions>
          <div
            dangerouslySetInnerHTML={{
              __html: newsinfo.content,
            }}
            style={{ border: '0.5px solid green', margin: '0 24px' }}
          />
        </div>
      )}
    </div>
  );
};
export default id;
