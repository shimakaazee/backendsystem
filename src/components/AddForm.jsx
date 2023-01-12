import { forwardRef } from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Popover,
  Switch,
  Form,
  Input,
  Select,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import list from '../pages/user-manage/list';

const { confirm } = Modal;

const AddForm = forwardRef(({ region, role, isupsAtive }, ref) => {
  const [isAtive, setisAtive] = useState(false);
  const {
    username,
    region: a,
    roleId,
  } = JSON.parse(localStorage.getItem('token'));

  const roleOBJ = {
    1: 'superadmin',
    2: 'admin',
    3: 'editor',
  };
  useEffect(() => {
    setisAtive(isupsAtive);
  }, [isupsAtive]);

  const checkregion = (item) => {
    if (isupdate) {
      if (roleOBJ[roleId] === 'superadmin') {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleOBJ[roleId] === 'superadmin') {
        return false;
      } else {
        return item.value !== a;
      }
    }
  };

  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isAtive ? [] : [{ required: true, message: '请选择区域!' }]}
      >
        <Select disabled={isAtive}>
          {region.map((item) => {
            return (
              <Option
                value={item.value}
                key={item.id}
                disabled={checkregion(item)}
              >
                {item.title}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: '请选择角色!' }]}
      >
        <Select
          onChange={(value) => {
            if (value === 1) {
              setisAtive(true);
              ref.current.setFieldsValue({
                region: '',
              });
            } else {
              setisAtive(false);
            }
          }}
        >
          {role.map((item) => {
            return (
              <Option value={item.id} key={item.id} disabled={checkrole(item)}>
                {item.roleName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
});
export default AddForm;
