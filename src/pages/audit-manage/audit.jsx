import { Table, Button, notification } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const audit = () => {
  const [table, settable] = useState([]);
  const { username, region, roleId } = JSON.parse(
    localStorage.getItem('token'),
  );
  useEffect(() => {
    const roleOBJ = {
      1: 'superadmin',
      2: 'admin',
      3: 'editor',
    };
    axios
      .get('http://localhost:5000/news?auditState=1&_expand=category')
      .then((res) => {
        settable(
          roleOBJ[roleId] === 'superadmin'
            ? res.data
            : [
                ...res.data.filter((item) => item.author === username),
                ...res.data.filter(
                  (item) =>
                    item.region === region && roleOBJ[item.roleId] === 'editor',
                ),
              ],
        );
      });
  }, [roleId, username, region]);
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
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              type="primary"
              onClick={() => handlenews(item, 2, 1)}
              disabled={item.default}
            >
              通过
            </Button>
            <Button danger onClick={() => handlenews(item, 3, 0)}>
              不通过
            </Button>
          </div>
        );
      },
    },
  ];
  const handlenews = (item, auditState, publishState) => {
    settable(table.filter((data) => data.id !== item.id));
    axios
      .patch(`http://localhost:5000/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: '通知',
          description: `请到审核列表查看`,
          placement: 'bottomRight',
        });
      });
  };
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
export default audit;
