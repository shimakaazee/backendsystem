import { Redirect } from 'umi';
import home from './home';
const error = () => {
  return <div>404</div>;
};
error.wrappers = ['@/wrappers/Auth'];
export default error;
