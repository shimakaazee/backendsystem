import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useHistory } from 'umi';
import axios from 'axios';
import './login.less';
const login = () => {
  const history = useHistory();
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesLoaded = (container) => {};
  const onFinish = (values) => {
    // console.log(values)
    axios
      .get(
        `http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`,
      )
      .then((res) => {
        if (res.data.length === 0) {
          message.error('登录不成功');
        } else {
          localStorage.setItem('token', JSON.stringify(res.data[0]));
          history.push('/home');
        }
      });
  };
  return (
    <div style={{ height: '100vh', background: 'rgb(35,39,65)' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: '#0d47a1',
            },
            position: '50% 50%',
            repeat: 'no-repeat',
            size: 'cover',
          },
          fullScreen: {
            zIndex: 1,
          },
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'repulse',
              },
              onHover: {
                enable: true,
                mode: 'bubble',
              },
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 0.3,
                opacity: 1,
                size: 4,
                divs: {
                  distance: 200,
                  duration: 0.4,
                  mix: false,
                  selectors: [],
                },
              },
              grab: {
                distance: 400,
                links: {
                  opacity: 0.5,
                },
              },
              repulse: {
                divs: {
                  distance: 200,
                  duration: 0.4,
                  factor: 100,
                  speed: 1,
                  maxSpeed: 50,
                  easing: 'ease-out-quad',
                  selectors: [],
                },
              },
            },
          },
          particles: {
            links: {
              color: {
                value: '#ffffff',
              },
              distance: 500,
              opacity: 0.4,
              width: 2,
            },
            move: {
              attract: {
                rotate: {
                  x: 600,
                  y: 1200,
                },
              },
              direction: 'bottom',
              enable: true,
              outModes: {
                bottom: 'out',
                left: 'out',
                right: 'out',
                top: 'out',
              },
            },
            number: {
              density: {
                enable: true,
              },
              value: 400,
            },
            opacity: {
              random: {
                enable: true,
              },
              value: {
                min: 0.1,
                max: 0.5,
              },
              animation: {
                speed: 1,
                minimumValue: 0.1,
              },
            },
            size: {
              random: {
                enable: true,
              },
              value: {
                min: 1,
                max: 10,
              },
              animation: {
                speed: 40,
                minimumValue: 0.1,
              },
            },
          },
        }}
      />
      <div className="loginform">
        <div className="logintitle">后台登录</div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default login;
