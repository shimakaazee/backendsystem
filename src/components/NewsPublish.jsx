import { Table } from 'antd';
const NewsPublish = (props) => {
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title;
      },
    },
    {
      title: '开关',
      render: (item) => {
        return <div>{props.button(item.id)}</div>;
      },
    },
  ];
  return (
    <>
      <Table
        dataSource={props.table}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </>
  );
};
export default NewsPublish;
