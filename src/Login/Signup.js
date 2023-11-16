import React, { useState } from "react";
import { Form, Input, Button, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import "./login.css"
import { Formik } from "formik";
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import * as Yup from "yup";
import ReactDatePicker from "react-datepicker";
import { useHistory } from 'react-router-dom';


function Signup() {
  const history = useHistory();
  const [maxPhoneNumberLength, setMaxPhoneNumberLength] = useState(null);

  const SignupSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),
    lastname: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is Required"),
    dateOfBirth: Yup.date().required('Required'),
    password: Yup.string()
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    mobile_number: Yup
      .number()
      .required(`${'mobile_number'} ${'required'}`)
      .test('mobile validation', 'invalid_mobile_number', (value) => {
        try {
          if (value !== undefined && (String(value).length === maxPhoneNumberLength)) {
            return true;
          }
        } catch (err) {
          // console.log(err);
        }
        return false;
      }),
  });

  const saveUserDetails = (val) => {
    axios.post('http://127.0.0.1:8000/instamart/signUp/', { SignUpData:val })
      .then((response) => {
        console.log(response)
      })
  }
  return (
    <div className="login">
      <div className="Signup-backround">
        <div className="login-Header">
          <Image src="./logo.png" size="small" />
          <span className="Welcome-back">Signup to feel the rendal experience</span>
        </div>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            dateOfBirth: '',
            password: '',
            mobile_number: '',
          }}
          onSubmit={saveUserDetails}
          validationSchema={SignupSchema}
        >
          {({ values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => {
            const mobileInputField = (phone, country) => {
              // eslint-disable-next-line no-useless-escape
              setMaxPhoneNumberLength(country.format.replace(/[\+()-\s]/g, '').length);
              setFieldValue('mobile_number', phone);
            };
            return (
              <Form className="form"
                onSubmit={handleSubmit}
              >
                <Form.Field
                  required
                  name='firstname'
                  control={Input}
                  value={values.firstname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='text'
                  error={touched.firstname && errors.firstname}
                  label='First Name'
                  placeholder='Enter your first name'
                />
                <Form.Field
                  required
                  name='lastname'
                  control={Input}
                  value={values.lastname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='text'
                  error={touched.lastname && errors.lastname}
                  label='Last Name'
                  placeholder='Enter your first name'
                />
                <Form.Field
                  values={values.email}
                  control={Input}
                  label="Email"
                  placeholder="Email..."
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email}
                />
                <Form.Field
                  required
                  name='dateOfBirth'
                  control={ReactDatePicker}
                  selected={values.dateOfBirth}
                  onChange={(e) => setFieldValue('dateOfBirth', e)}
                  label='Date of Birth'
                  placeholderText='Select date of birth'
                  dateFormat='dd/MM/yyyy'
                  error={touched.dateOfBirth && errors.dateOfBirth}
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
                <Form.Field
                  fontas="alpha"
                  required
                  label='Mobile Number'
                  control={PhoneInput}
                  name="mobile_number"
                  country="in"
                  countryCodeEditable={false}
                  onChange={(phone, country) => mobileInputField(phone, country)}
                  onBlur={handleBlur}
                  value={values.mobile_number}
                  error={touched.mobile_number && errors.mobile_number}
                />
                <div className="loginbutton">
                  <Button type="submit">Sign Up</Button>
                </div>
                <div className="sign-Up-instead">
                <span>Already a user?</span>
                <span
                  className="sign-Up-span"
                  onClick={() => history.push('/')}
                >
                  Signin
                </span>
                <span>instead</span>
              </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div >
  )
}
export default Signup;
