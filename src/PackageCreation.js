import React, { useRef } from 'react';
import { Button, Form, Input, Label } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Formik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
// import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function PackageCreation() {
  const packageImageRef = useRef(null);
  // const { state: { EditItem } } = useLocation();

  const SignupSchema = Yup.object().shape({
    package_image: Yup.mixed()
      .required('Please select a file')
      .test('size', 'Large file size', (file) => !file || (file && file.size < 500000))
      .test('fileType', 'Only .png and .jpeg files are allowed', (file) => !file || (file && ['image/png', 'image/jpeg'].includes(file.type))),
    package: Yup.string().required('Required'),
    package_amount: Yup.number().required('Required'),
    combo: Yup.string().required('Required'),
    expiry_date: Yup.date().required('Required'),
  });

  const packageDetails = (val) => {
    const formData = new FormData();
    formData.append('upload', val.package_image);
    formData.append('package', val.package);
    formData.append('package_amount', val.package_amount);
    formData.append('combo', val.combo);
    formData.append('expiry_date', new Date(val.expiry_date).toISOString());
    axios.post('http://127.0.0.1:8000/instamart/packageDetails/', formData)
      .then((response) => {
        console.log(response)
      })
  }

  return (
    <div className='app'>
      <div className='signup'>
        <Formik
          initialValues={{
            package_image: '',
            package: '',
            package_amount: '',
            combo: '',
            expiry_date: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={packageDetails}
        >
          {({ values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => {
            const handleFileUpload = (e) => {
              setFieldTouched(e.target.name, true);
              setFieldValue(e.target.name, e.currentTarget.files[0]);
            };
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <div>
                    <Button basic type="button" content={'Choose File'} onClick={() => packageImageRef.current.click()} />
                    <span>
                      {values.package_image ? values.package_image.name : 'No file chosen'}
                    </span>
                    {touched.package_image && errors.package_image && (
                      <Label basic color="red" pointing="left">
                        {errors.package_image}
                      </Label>
                    )}
                    <input
                      name="package_image"
                      type="file"
                      accept="image/png, image/jpeg"
                      ref={packageImageRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </Form.Field>
                <Form.Field
                  required
                  name='package'
                  control={Input}
                  value={values.package}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='text'
                  label='Package'
                  placeholder='Enter package'
                  error={touched.package && errors.package}
                />
                <Form.Field
                  required
                  name='package_amount'
                  control={Input}
                  value={values.package_amount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='number'
                  label='Package Amount'
                  placeholder='Enter amount'
                  error={touched.package_amount && errors.package_amount}
                />
                <Form.Field
                  required
                  name='combo'
                  control={Input}
                  value={values.combo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='text'
                  label='Combo'
                  placeholder='Enter combo'
                  error={touched.combo && errors.combo}
                />
                <Form.Field
                  name='expiry_date'
                  control={DatePicker}
                  selected={values.expiry_date}
                  onChange={(date) => setFieldValue('expiry_date', date)}
                  onBlur={() => setFieldTouched('expiry_date', true)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  label="Expiry date"
                  error={touched.expiry_date && errors.expiry_date}
                />
                <Button type="submit">Submit</Button>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default PackageCreation;
