import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { Container } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useLazyRequest } from '../lib/requestHooks'
import './styles.css';
import { loginRequest } from '../lib/api';
import { saveSession } from '../lib/auth';

export const LoginForm = withRouter((props) => {
  const { register, handleSubmit, watch, errors } = useForm()
  // const [ userData, setUserData] = useState();
  const [ loginUser, { isLoading, data: userData } ] = useLazyRequest(loginRequest);
  // const isLoading = false;

  const onSubmit = data => {
    // console.log(data);
    loginUser(data);
  }

  if(userData) {
    const { data: user } = userData; 
    saveSession(user.token);
    props.history.push('/', { authenticated: true });
  }

  return isLoading ? <div>Loading..</div> :(
    <Container maxWidth="sm">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            ref={register({ required: true })}
          />
          {errors.username && <span className="error">This field is required</span>}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            aria-describedby="password-helper-text"
            ref={register({ required: true })}
          />
          {errors.password && <span className="error">This field is required</span>}
          <input type="submit" />
          <Link to="/register">Register new user</Link>
        </form>
      </div>
    </Container>
  );
});
