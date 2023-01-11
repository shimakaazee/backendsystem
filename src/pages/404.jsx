import {Redirect} from "umi"
import home from "./home";
const error = ()=>{
  return (
    <Redirect to='/home' />
  )
}
error.wrappers = ['@/wrappers/Auth'];
export default error
