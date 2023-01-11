import {Layout, Menu, theme} from 'antd';
import {useState, useEffect} from "react";
import {useHistory, useLocation} from "umi";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import "./sider.less"
import axios from "axios";

const {Sider} = Layout;

const iconList = {
  '/home': <UserOutlined/>,
  '/user-manage/list': <UserOutlined/>,
  '/user-manage': <UserOutlined/>,
  '/right-manage/role/list': <UserOutlined/>,
  '/right-manage/right/list': <UserOutlined/>,
  '/right-manage': <UserOutlined/>,
}
const sider = () => {
  const [collapsed] = useState(false);
  const history = useHistory();
  /*const menulist = [{
    key: "/home",
    icon: <UserOutlined/>,
    label: "首页"
  },
    {
      key: "/user-manage",
      icon: <UserOutlined/>,
      label: "用户管理",
      children: [
        {
          key: "/user-manage/list",
          icon: <UserOutlined/>,
          label: "用户列表"
        }
      ]
    },
    {
      key: "/right-manage",
      icon: <UserOutlined/>,
      label: "权限管理",
      children: [
        {
          key: "/right-manage/role/list",
          icon: <UserOutlined/>,
          label: "角色列表"
        },
        {
          key: "/right-manage/right/list",
          icon: <UserOutlined/>,
          label: "权限列表"
        }
      ]
    }
  ]*/

  const [menulist, setmenulist] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(
      res => {
        setmenulist(res.data)
      }
    )
  }, [])
  const checkpagepermission = (pe) => {
    return pe.pagepermission === 1
  }
  const check = (list) => {
    return list.map(item => {
      console.log(item)
      if (item.children && checkpagepermission(item) && item.children.length > 0) {
        return {
          key: item.key,
          label: item.title,
          icon: iconList[item.key],
          children: check(item.children)
        }
      }
      return checkpagepermission(item) && {
        key: item.key,
        icon: iconList[item.key],
        label: item.title
      }
    })
  }
  const location = useLocation()
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{display: 'flex', height: '100%', flexDirection: 'column'}}>
        <div className="logo">后台系统</div>
        <div style={{flex: 1, overflow: 'auto'}}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['/'+location.pathname.split('/')[1]]}
            items={check(menulist)}
            onClick={({key}) => {
              history.push(key);
            }}
          />

        </div>

      </div>
    </Sider>
  )
}

export default sider

