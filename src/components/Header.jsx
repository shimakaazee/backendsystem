import {Avatar, Layout, Menu, theme} from 'antd';
import {useState} from "react";
import { Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

const {Header} = Layout;
const header = () => {

  const [collapsed, setcollapsed] = useState(false);

  const change = () => {
    setcollapsed(!collapsed)
  }

  const  items=[
      {
        key: '1',
        label: (
          <a target="_blank" rel="noopener noreferrer" >
            超级管理员Admin
          </a>
        ),
      },

      {
        key: '4',
        danger: true,
        label: '退出',
      },
    ];


  return (
    <Header className="site-layout-background"
            style={{
              padding: '0 16px',
            }}
    >
      {
        collapsed ? <MenuUnfoldOutlined onClick={change}/> : <MenuFoldOutlined onClick={change}/>
      }

      <div style={{float:"right"}}>
        <Dropdown  menu={{items}}>
          <Space>
            欢迎回来
          <Avatar size={50} icon={<UserOutlined/>}></Avatar>
          </Space>
        </Dropdown>
      </div>

    </Header>
  )

}

export default header
