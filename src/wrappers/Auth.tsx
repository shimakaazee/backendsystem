import React from 'react';
import { Redirect } from 'umi';
const Auth = (props: any) => {
  if (localStorage.getItem('token')) {
    return <div>{props.children}</div>;
  }
  return <Redirect to="/login" />;
};

export default Auth;
