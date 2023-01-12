import NewsPublish from '../../components/NewsPublish';
import { Button } from 'antd';
import useNews from '../../components/useNews';

const published = () => {
  const { table, handleSunset } = useNews(2);
  return (
    <div>
      <NewsPublish
        table={table}
        button={(id) => (
          <Button danger onClick={() => handleSunset(id)}>
            下线
          </Button>
        )}
      />
    </div>
  );
};
export default published;
