import { Button, Steps, Form, Input, Select } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'umi';
import axios from 'axios';
import Edit from '../../components/Edit';

const { Step } = Steps;
const add = () => {
  const [current, setcurrent] = useState(0);
  const formref = useRef();
  const [categoryList, setcategoryList] = useState([]);

  const [editorState, seteditorState] = useState('');
  const [content, setcontent] = useState({});
  const history = useHistory();
  const User = JSON.parse(localStorage.getItem('token'));
  const handlenews = (auditnum) => {
    axios
      .post('http://localhost:5000/news', {
        ...content,
        content: editorState,
        region: User.region ? User.region : '全球',
        author: User.username,
        roleId: User.roleId,
        auditState: auditnum,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        // "publishTime": 1615778911028
      })
      .then((res) => {
        history.push(
          auditnum === 0 ? '/news-manage/draft' : '/audit-manage/list',
        );
        notification.info({
          message: '通知',
          description: `请到${auditnum === 0 ? '草稿箱' : '审核列表'}查看`,
          placement: 'bottomRight',
        });
      });
  };

  useEffect(() => {
    axios.get('http://localhost:5000/categories').then((res) => {
      setcategoryList(res.data);
    });
  }, []);
  return (
    <div>
      <h1>编写新闻</h1>
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      <div style={{ marginTop: '40px' }}>
        <div style={{ display: current === 0 ? '' : 'none' }}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            ref={formref}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入标题!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择分类!' }]}
            >
              <Select>
                {categoryList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div style={{ display: current === 1 ? '' : 'none' }}>
          <Edit
            getcontent={(values) => {
              seteditorState(values);
            }}
          />
        </div>
        <div style={{ display: current === 2 ? '' : 'none' }}></div>
      </div>
      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handlenews(0)}>
              保存草稿
            </Button>
            <Button danger onClick={() => handlenews(1)}>
              提交审核
            </Button>
          </span>
        )}

        {current < 2 && (
          <Button
            type="primary"
            onClick={() => {
              if (current === 0) {
                fromref.current.validateFields().then((res) => {
                  setcontent(res);
                  setcurrent(current + 1);
                });
              } else {
                if (editorState === '' || editorState.trim() === '<p></p>') {
                  message.error('请输入内容');
                } else {
                  setcurrent(current + 1);
                }
              }
            }}
          >
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button
            type="primary"
            onClick={() => {
              setcurrent(current - 1);
            }}
          >
            上一步
          </Button>
        )}
      </div>
    </div>
  );
};

export default add;
