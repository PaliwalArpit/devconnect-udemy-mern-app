import React, { Fragment, useState } from "react";
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
   
    //   const newUser = {
    //     name,
    //     email,
    //     password,
    //   };
    //   try {
    //     const config = {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     };
    //     const body = JSON.stringify(newUser);
    //     const res = await axios.post("/api/users", body, config);
    //     console.log(res.data);
    //   } catch (err) {
    //     console.log(err.res.data);
    //   }
    console.log('success');
  };
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign in into your account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            name="email"
            onChange={(e) => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            minlength="6"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input type="submit" value="Login" className="btn btn-primary" />
      </form>
      <p className="my-1">
       Dont have a account? <Link to="/register">Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Login;
