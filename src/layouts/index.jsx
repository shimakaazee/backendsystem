import {Layout, Menu} from 'antd'

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined

} from '@ant-design/icons'
import Sider from '../components/Sider'
import Header from '../components/Header'
import './index.less'

const {Content} = Layout;

const index = (props) => {
  return (
    <Layout>
      <Sider/>
      <Layout className="site-layout">
        <Header/>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default index
