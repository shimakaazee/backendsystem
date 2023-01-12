import { Table, Button, Modal, notification } from 'antd';
import { useState, useEffect } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'umi';

const { confirm } = Modal;

const draft = () => {
  const [table, settable] = useState([]);
  const history = useHistory();
  const { username } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/news?author=${username}&auditState=0&_expand=category`,
      )
      .then((res) => {
        settable(res.data);
      });
  }, []);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>;
      },
    },
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
      title: '开关',
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteitem(item);
              }}
            />

            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                history.push(`/news-manage/update/${item.id}`);
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<CloudUploadOutlined />}
              onClick={() => handleup(item.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleup = (id) => {
    axios
      .patch(`http://localhost:5000/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        history.push('/audit-manage/list');
        notification.info({
          message: '通知',
          description: `请到审核列表查看`,
          placement: 'bottomRight',
        });
      });
  };
  const deleteitem = (item) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确认删除吗',
      onOk() {
        deleteok(item);
      },
      onCancel() {},
    });
  };
  const deleteok = (item) => {
    //   console.log(item)
    settable(table.filter((data) => data.id !== item.id));
    axios.delete(`http://localhost:5000/news/${item.id}`);
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

export default draft;
