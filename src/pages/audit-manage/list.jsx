import { Table, Tag, Button, notification } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'umi';

const list = () => {
  const [table, settable] = useState([]);
  const history = useHistory();
  const { username } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`,
      )
      .then((res) => {
        settable(res.data);
      });
  }, []);
  const auditList = ['草稿箱', '审核中', '已通过', '未通过'];
  const colorList = ['', 'orange', 'green', 'red'];

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: '开关',
      render: (item) => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button
                onClick={() => {
                  settable(table.filter((data) => data.id !== item.id));
                  axios
                    .patch(`http://localhost:5000/news/${item.id}`, {
                      auditState: 0,
                    })
                    .then((res) => {
                      notification.info({
                        message: '通知',
                        description: `请到草稿箱查看`,
                        placement: 'bottomRight',
                      });
                    });
                }}
              >
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button
                danger
                onClick={() => {
                  axios
                    .patch(`http://localhost:5000/news/${item.id}`, {
                      publishState: 2,
                    })
                    .then((res) => {
                      history.push('/publish-manage/published');
                      notification.info({
                        message: '通知',
                        description: `请到【发布管理/已发布】查看`,
                        placement: 'bottomRight',
                      });
                    });
                }}
              >
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button
                type="primary"
                onClick={() => {
                  history.push(`/news-manage/update/${item.id}`);
                }}
              >
                更新
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Table
        dataSource={table}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </>
  );
};
export default list;
