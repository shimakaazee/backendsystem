import axios from 'axios';
import {useState, useEffect} from 'react';
import {Table, Tag, Button, Modal, Form, Input, Switch} from 'antd'
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'

const {confirm} = Modal


const list = () => {
  const [table, settable] = useState([])
  const [visible, setvisible] = useState(false)
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return <b>{role.roleName}</b>
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',

    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handlechange(item)}/>
      }

    },
    {
      title: '开关',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => {
            deleteitem(item)
          }} disabled={item.default}/>
          <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.default}/>

        </div>
      }
    }
  ]
  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then(
      res => {
        settable(res.data)
      }
    )
  }, [])

  const deleteitem = (item) => {
    confirm({
      icon: <ExclamationCircleOutlined/>,
      content: '确认删除吗',
      onOk() {
        deleteok(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const deleteok = (item) => {
    settable(table.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }

  const handlechange = (item) => {
    item.roleState = !item.roleState
    settable([...table])
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  return (
    <>
      <Button type='primary' onClick={() => {
        setvisible(true)
      }}>添加用户</Button>
      <Table dataSource={table} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>

      <Modal
        visible={visible}
        title="添加用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setvisible(false)
        }}
        onOk={() => {
          // console.log(ok)
        }}
      >
        <Form
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{required: true, message: '请输入用户名!'}]}
          >
            <Input/>
          </Form.Item>
          ～～～##
        </Form>
      </Modal>
    </>
  )
}

export default list
