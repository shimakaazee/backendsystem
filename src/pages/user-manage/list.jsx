import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Table, Tag, Button, Modal, Form, Input, Switch, Select } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import AddForm from '../../components/AddForm';

const { confirm } = Modal;
const { option } = Select;

const list = () => {
  const [table, settable] = useState([]);
  const [visible, setvisible] = useState(false);
  const [region, setregion] = useState([]);
  const [role, setrole] = useState([]);
  const [current, setcurrent] = useState();
  const [upvisible, setupvisible] = useState(false);
  const [isAtive, setisAtive] = useState(false);
  const ref = useRef();
  const upref = useRef();
  const {
    username,
    region: a,
    roleId,
  } = JSON.parse(localStorage.getItem('token'));
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>;
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return <b>{role?.roleName}</b>;
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handlechange(item)}
          />
        );
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
              disabled={item.default}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => {
                handleupdate(item);
              }}
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then((res) => {
      settable(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/regions').then((res) => {
      setregion(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res) => {
      setrole(res.data);
    });
  }, []);

  useEffect(() => {
    const roleOBJ = {
      1: 'superadmin',
      2: 'admin',
      3: 'editor',
    };
    axios.get('http://localhost:5000/users?_expand=role').then((res) => {
      settable(
        roleOBJ[roleId] === 'superadmin'
          ? res.data
          : [
              ...res.data.filter((item) => item.username === username),
              ...res.data.filter(
                (item) =>
                  item.region === a && roleOBJ[item.roleId] === 'editor',
              ),
            ],
      );
    });
  }, [roleId, username, a]);

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
    settable(table.filter((data) => data.id !== item.id));
    axios.delete(`http://localhost:5000/users/${item.id}`);
  };

  const handlechange = (item) => {
    item.roleState = !item.roleState;
    settable([...table]);
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  const handleupdate = (item) => {
    setTimeout(() => {
      setupvisible(true);
      if (item.roleId === 1) {
        setisAtive(true);
      } else {
        setisAtive(false);
      }
      upref.current.setFieldsValue(item);
    }, 0);
    setcurrent(item);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setvisible(true);
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={table}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />

      <Modal
        visible={visible}
        title="添加用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setvisible(false);
        }}
        onOk={() => {
          // console.log(ref.current.validateFields())
          ref.current
            .validateFields()
            .then((res) => {
              // console.log(res)
              setvisible(false);
              ref.current.resetFields();
              axios
                .post(`http://localhost:5000/users`, {
                  ...res,
                  roleState: true,
                  default: false,
                })
                .then((re) => {
                  // console.log(re)
                  settable([
                    ...table,
                    {
                      ...re.data,
                      role: role.filter((item) => item.id === res.roleId)[0],
                    },
                  ]);
                });
            })
            .catch((err) => console.log(err));
        }}
      >
        <AddForm region={region} role={role} ref={ref} />
      </Modal>

      <Modal
        visible={upvisible}
        title="修改用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setupvisible(false);
          setisAtive(!isAtive);
        }}
        onOk={() => {
          // console.log(ref.current.validateFields())
          upref.current.validateFields().then((res) => {
            // console.log(res)
            setupvisible(false);
            settable(
              table.map((item) => {
                if (item.id === current.id) {
                  return {
                    ...item,
                    ...res,
                    role: role.filter((data) => data.id === res.roleId)[0],
                  };
                }
                return item;
              }),
            );
            setisAtive(!isAtive);
            axios.patch(`http://localhost:5000/users/${current.id}`, res);
          });
        }}
      >
        <AddForm
          region={region}
          role={role}
          ref={upref}
          isupsAtive={isAtive}
          isupdate={true}
        />
      </Modal>
    </>
  );
};

export default list;
