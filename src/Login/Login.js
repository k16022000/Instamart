import React from "react";
import { Form, Input, Button, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import "./login.css"
import { Formik } from "formik";
import axios from 'axios';
import * as Yup from "yup";
import { useHistory } from 'react-router-dom';

function Login() {
  const history = useHistory();
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is Required"),
    password: Yup.string()
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  const signIn = (val) => {
    axios.post('http://127.0.0.1:8000/instamart/signin/', { ...val })
      .then((response) => {
        const { data } = response;
        if (data[0].login_status === 'Login sucsessfull') {
          history.push("/homePage", { navigation: true, Email: data[0].email });
        }
      })
  }
  return (
    <div className="login">
      <div className="login-backround">
        <div className="login-Header">
          <Image src="./logo.png" size="small" />
          <span className="Welcome-back">Welcome back, Instasmarter!</span>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={signIn}
          validationSchema={SignupSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form className="form"
              onSubmit={handleSubmit}
            >
              <Form.Field
                values={values.email}
                control={Input}
                label="Email"
                icon="user"
                iconPosition="left"
                placeholder="Email..."
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email && touched.email}
              />
              <Form.Field
                values={values.password}
                control={Input}
                label="Password"
                icon="lock"
                iconPosition="left"
                placeholder="Password..."
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password && touched.password}
              />
              <div className="loginbutton">
                <Button type="submit">Signin</Button>
              </div>
              <div className="sign-Up-instead">
                <span>New to INSTASMART?</span>
                <span
                  className="sign-Up-span"
                  onClick={() => history.push('/signup')}
                >
                  Sign Up
                </span>
                <span>instead</span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
export default Login;
