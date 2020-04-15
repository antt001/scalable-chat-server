import React, { useState } from "react";
import { useForm } from 'react-hook-form'
import { Redirect, withRouter } from 'react-router-dom';
import { Container } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useLazyRequest } from '../lib/requestHooks'
import { registerRequest } from '../lib/api';
import { saveSession } from "../lib/auth";
import "./styles.css";

export const RegisterForm = withRouter((props) => {
  const { register, handleSubmit, watch, getValues, errors } = useForm()
  const [ registerUser, { isLoading, data: userData } ] = useLazyRequest(registerRequest);
  const onSubmit = data => {
    registerUser(data);
    console.log({data, v: getValues()});
  }

  if(userData) {
    const { data: user } = userData; 
    saveSession(user.token);
    return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
  }

  return isLoading ? <div>Loading..</div> : (
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
            ref={register({ required: true })}
          />
          {errors.password && <span className="error">This field is required</span>}
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            ref={register({ required: true, validate: value => value ===  watch('password')  || 'Passwords don\'t match.' })}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword.message || 'This field is required'}</span>}
          <input type="submit" />
          <Link to="/login">Login</Link>
        </form>
      </div>
    </Container>
  );
});