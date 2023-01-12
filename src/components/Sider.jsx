import { Layout, Menu, theme } from 'antd';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'umi';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import './sider.less';
import axios from 'axios';

const { Sider } = Layout;

const iconList = {
  '/home': <UserOutlined />,
  '/user-manage/list': <UserOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage/role/list': <UserOutlined />,
  '/right-manage/right/list': <UserOutlined />,
  '/right-manage': <UserOutlined />,
};
const sider = () => {
  const [collapsed] = useState(false);
  const history = useHistory();

  const [menulist, setmenulist] = useState([]);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      setmenulist(res.data);
    });
  }, []);
  const checkpagepermission = (pe) => {
    return pe.pagepermission && rights.checked.includes(pe.key);
  };
  const check = (list) => {
    return list.map((item) => {
      console.log(item);
      if (
        item.children &&
        checkpagepermission(item) &&
        item.children.length > 0
      ) {
        return {
          key: item.key,
          label: item.title,
          icon: iconList[item.key],
          children: check(item.children),
        };
      }
      return (
        checkpagepermission(item) && {
          key: item.key,
          icon: iconList[item.key],
          label: item.title,
        }
      );
    });
  };
  const location = useLocation();
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo">后台系统</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
            items={check(menulist)}
            onClick={({ key }) => {
              history.push(key);
            }}
          />
        </div>
      </div>
    </Sider>
  );
};

export default sider;
