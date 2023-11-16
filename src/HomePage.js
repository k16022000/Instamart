import React, { useEffect, useState, useRef } from 'react'
import Header from './Header/Header'
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from "yup";
import { useLocation } from 'react-router-dom';
import { Button, Form, Grid, Icon, Input, Label, Modal } from 'semantic-ui-react'
import "./homePage.css"
import { useHistory } from 'react-router-dom';

function HomePage() {
  const packagecontainsImageRef = useRef(null);
  const history = useHistory();
  const { state: { Email } } = useLocation();
  const [activeTab, setActiveTab] = useState(0)
  const [array, setArray] = useState([])
  const [menuName, setMenuName] = useState('')
  const [item, setItem] = useState('')
  const [open, setOpen] = useState(false)
  const [packageId, setPackageId] = useState('')
  const menu = ['Packages', 'Products', 'My Rental', 'Edit Profile']


  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    packagecontains_image: Yup.mixed()
      .required('Please select a file')
      .test('size', 'Large file size', (file) => !file || (file && file.size < 500000))
      .test('fileType', 'Only .png and .jpeg files are allowed', (file) => !file || (file && ['image/png', 'image/jpeg'].includes(file.type))),
    packagecontains_amount: Yup.number().required('Required'),
    brand: Yup.string().required('Required'),
    Dimension: Yup.string().required('Required'),
  });
  const allItemsList = () => {
    axios.get('http://127.0.0.1:8000/instamart/allpackageDetails/')
      .then(response => {
        // Handle successful response
        const { data } = response;
        setArray(data.package_list);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const packageItems = (val) => {
    console.log(val,'val-------')
    axios.get('http://127.0.0.1:8000/instamart/packageItems/', { id: val })
      .then((response) => {
        console.log(response)
      })
  }
  useEffect(() => {
    allItemsList();
  }, [])

  const savePackageDetails = (val) => {
    const formData = new FormData();
    formData.append('id', packageId)
    formData.append('name', val.name);
    formData.append('upload', val.packagecontains_image);
    formData.append('packagecontains_amount', val.packagecontains_amount);
    formData.append('brand', val.brand);
    formData.append('Dimension', val.Dimension);
    axios.post('http://127.0.0.1:8000/instamart/savePackageDetails/', formData)
      .then((response) => {
        console.log(response)
      })
  }

  return (
    <div>
      <Header
        menuName={menuName}
      />
      <Grid divided='vertically' className='left-side-Grid'>
        <Grid.Row columns={2}>
          <Grid.Column width={3} className='left-side-Column'>
            {
              menu.map((ele, i) => (
                <span
                  className={activeTab === i ? 'left-side-content' : 'left-side-con'}
                  onClick={() => {
                    setActiveTab(i);
                    setMenuName(ele);
                  }}
                >
                  {ele}
                </span>
              ))
            }
          </Grid.Column>
          <Grid.Column width={13}>
            <div className='right-side-Packages'>
              <div><h3>{menuName}</h3></div>
              <Grid className='right-side'>
                <Grid.Row columns={3} className='right-side-GridRow'>
                  {array.map((ele, index) => (
                    <Grid.Column
                      width={5}
                      className='right-side-GridColumn'
                      onMouseLeave={() => setItem()}
                    >
                      {
                        (Email === 'kavi@gmail.com' && item === ele.id) && (
                          <span
                            className='editIcon'
                          >
                            <Icon
                              name="edit"
                              onClick={() => history.push("/PackageCreation", { navigation: true, EditItem: ele })}
                            />
                            <Icon
                              name="plus square"
                              onClick={() => {
                                setOpen(true);
                                setPackageId(ele.id)
                              }}
                            />
                          </span>
                        )
                      }
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyPress={null}
                        className='right-side-GridColumndiv'
                        onClick={() => packageItems(ele.id)}
                        onMouseEnter={() => setItem(ele.id)}
                      >
                        <div>
                          <img src={ele.resource_link} alt='a'>
                          </img>
                        </div>
                        <div className='right-side-span'>
                          <span>{ele.package}</span>
                          <span>{`$${ele.package_amount} / month`}</span>
                          <span>{ele.combo}</span>
                        </div>
                      </div>
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal
        centered={false}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Modal.Header className='ModalHeader'>
          <span>
            packageCreation
          </span>
          <span style={{ 'cursor': 'pointer' }}>
            <Icon
              name='remove circle'
              onClick={() => setOpen(false)}
            />
          </span>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Formik
              initialValues={{
                name: '',
                packagecontains_image: '',
                packagecontains_amount: '',
                brand: '',
                Dimension: '',
              }}
              validationSchema={SignupSchema}
              onSubmit={savePackageDetails}
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
                    <Form.Field
                      required
                      name='name'
                      control={Input}
                      value={values.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type='text'
                      label='Name'
                      placeholder='Enter name'
                      error={touched.name && errors.name}
                    />
                    <Form.Field>
                      <div>
                        <Button basic type="button" content={'Choose File'} onClick={() => packagecontainsImageRef.current.click()} />
                        <span>
                          {values.packagecontains_image ? values.packagecontains_image.name : 'No file chosen'}
                        </span>
                        {touched.packagecontains_image && errors.packagecontains_image && (
                          <Label basic color="red" pointing="left">
                            {errors.packagecontains_image}
                          </Label>
                        )}
                        <input
                          name="packagecontains_image"
                          type="file"
                          accept="image/png, image/jpeg"
                          ref={packagecontainsImageRef}
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </Form.Field>
                    <Form.Field
                      required
                      name='packagecontains_amount'
                      control={Input}
                      value={values.packagecontains_amount}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type='number'
                      label='Package Contains Amount'
                      placeholder='Enter amount'
                      error={touched.packagecontains_amount && errors.packagecontains_amount}
                    />
                    <Form.Field
                      required
                      name='brand'
                      control={Input}
                      value={values.brand}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type='text'
                      label='Brand'
                      placeholder='Enter brand'
                      error={touched.brand && errors.brand}
                    />
                    <Form.Field
                      required
                      name='Dimension'
                      control={Input}
                      value={values.Dimension}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type='text'
                      label='Dimension'
                      placeholder='Enter dimension'
                      error={touched.Dimension && errors.Dimension}
                    />
                    <Button type="submit">Submit</Button>
                  </Form>
                )
              }}
            </Formik>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default HomePage