import axios from 'axios';
import {useState, useEffect} from 'react';
import {Table, Tag, Button, Modal, Popover, Switch} from 'antd'
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'

const {confirm} = Modal


const list = () => {
  const [table, settable] = useState([])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="purple">{key}</Tag>
      }
    },
    {
      title: '开关',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => {
            deleteitem(item)
          }}/>
          <Popover content={<div style={{textAlign: 'center'}}>
            <Switch checked={item.pagepermission} onChange={() => {
              switchmethod(item)
            }}/>
          </div>} title="页面配置项" trigger={item.pagepermission === undefined ? '' : 'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.pagepermission === undefined}/>
          </Popover>
        </div>
      }
    }
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(
      res => {
        const list = res.data
        list.forEach(item => {
          if (item.children.length === 0) {
            item.children = ''
          }
        })

        settable(list)
      }
    )
  }, []);

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
    //   console.log(item)
    if (item.grade === 1) {
      settable(table.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      let list = table.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      settable([...table])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  const switchmethod = (item) => {
    item.pagepermission = item.pagepermission === 1 ? 0 : 1
    settable([...table])
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermission: item.pagepermission
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermission: item.pagepermission
      })
    }
  }
  return (
    <Table dataSource={table} columns={columns} pagination={{pageSize: 5}}/>
  )
}

export default list
