import {
  Steps,
  Button,
  Form,
  Input,
  Select,
  message,
  notification,
} from 'antd';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'umi';
import Edit from '../../../components/Edit';
const { Step } = Steps;
const { Option } = Select;

const update = () => {
  const [current, setcurrent] = useState(0);
  const params = useParams();
  const fromref = useRef();
  const [catagoryList, setcatagoryList] = useState([]);
  const [editorState, seteditorState] = useState('');
  const [content, setcontent] = useState({});
  const history = useHistory();
  const handlenews = (auditnum) => {
    axios
      .patch(`http://localhost:5000/news/${params.id}`, {
        ...content,
        content: editorState,
        auditState: auditnum,
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
      setcatagoryList(res.data);
    });
  }, []);
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/news/${params.id}?_expand=category&_expand=role`,
      )
      .then((res) => {
        let { title, categoryId, content } = res.data;
        fromref.current.setFieldsValue({
          title,
          categoryId,
        });
        seteditorState(content);
      });
  }, [params.id]);
  return (
    <div>
      title="新闻修改" onBack={() => window.history.back()}
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
            ref={fromref}
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
                {catagoryList.map((item) => {
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
              // console.log(values)
              seteditorState(values);
            }}
            content={editorState}
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
                  // console.log(res)
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
export default update;
