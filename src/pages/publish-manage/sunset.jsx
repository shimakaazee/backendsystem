import NewsPublish from '../../components/NewsPublish';
import { Button } from 'antd';
import useNews from '../../components/useNews';

const sunset = () => {
  const { table, handleDelete } = useNews(3);
  return (
    <div>
      <NewsPublish
        table={table}
        button={(id) => (
          <Button danger onClick={() => handleDelete(id)}>
            删除
          </Button>
        )}
      />
    </div>
  );
};
export default sunset;
