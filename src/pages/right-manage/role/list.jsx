import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Table, Tag, Button, Modal, Tree } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { confirm } = Modal;

const list = () => {
  const ref = useRef();
  const upref = useRef();
  const [table, settable] = useState([]);
  const [treeData, settreeData] = useState([]);
  const [checkedKeys, setcheckedKeys] = useState([]);
  const [rightsid, setrightsid] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
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
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setcheckedKeys(item.rights);
                setrightsid(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res) => {
      settable(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      settreeData(res.data);
    });
  }, []);

  const deleteitem = (item) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确认删除吗',
      onOk() {
        deleteok(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const deleteok = (item) => {
    //   console.log(item)
    settable(table.filter((data) => data.id !== item.id));
    axios.delete(`http://localhost:5000/roles/${item.id}`);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    settable(
      table.map((item) => {
        if (item.id === rightsid) {
          return {
            ...item,
            rights: checkedKeys,
          };
        }
        return item;
      }),
    );
    axios.patch(`http://localhost:5000/roles/${rightsid}`, {
      rights: checkedKeys,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onCheck = (check) => {
    // console.log(check)
    setcheckedKeys(check);
  };

  return (
    <>
      <Table
        dataSource={table}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
      <Modal
        title="权限管理"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkStrictly
          checkable
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          treeData={treeData}
        />
      </Modal>
    </>
  );
};

export default list;
