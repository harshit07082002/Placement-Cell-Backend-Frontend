import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useInput from '../../hooks/use-input';
import { Card } from 'react-bootstrap';
import './RegisterPage.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Cookies from 'universal-cookie';
import ReactDom from 'react-dom';
import Error from '../../components/Error/Error';
import LoadingScreen from '../../components/Loader/LoadingScreen';
import { useDispatch } from 'react-redux'
import { authActions } from '../../store/authSlice';

const cur_year = new Date().getFullYear();
const batches = [cur_year, cur_year + 1, cur_year + 2];

const emailValidity = (email) => {
  if (!email.includes('@') || !email.includes('.')) {
    return false;
  } else {
    return true;
  }
}

const checkValidity = (value) => {
  if (value == '') {
    return false;
  } else {
    return true;
  }
}

const enrollmentValidity = (value) => {
  if (value === '') {
    return false;
  }
  for(let i=0; i < value.length; i++) {
    if (value[i] < '0' || value[i] > '9') {
      return false;
    }
  }
  return true;
}

const phoneValidity = (value) => {
  if (enrollmentValidity(value) && value.length === 10) {
    return true;
  } else {
    return false;
  }
}

const URLValidity = (URL) => {
  const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');    
  return regex.test(URL);
}

const PasswordValidity = (password) => {
  return password.length > 7
}

const semesterValidation = (semester) => {
  return semester <= 8 && semester >= 1;
}

const scgpaValidation = (scgpa) => {
  return scgpa <= 10;
}


const RegisterPage = () => {
  const [errorMsg, changeErrorMsg] = useState(undefined);
  const [isLoading, changeLoadingState] = useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    InputValue: emailValue,
    showError: emailShowError,
    onBlur: emailOnBlur,
    onChangeValue: emailOnChangeValue,
    isValid: emailValid,
    onSubmit: emailSubmit,
    reset: emailreset,
  } = useInput(emailValidity);

  const {
    InputValue: nameValue,
    showError: nameShowError,
    onBlur: nameOnBlur,
    onChangeValue: nameOnChangeValue,
    isValid: nameValid,
    onSubmit: nameSubmit,
    reset: namereset,
  } = useInput(checkValidity);
  
  const {
    InputValue: enrollmentValue,
    showError: enrollmentShowError,
    onBlur: enrollmentOnBlur,
    onChangeValue: enrollmentOnChangeValue,
    isValid: enrollmentValid,
    onSubmit: enrollmentSubmit,
    reset: enrollmentreset,
  } = useInput(enrollmentValidity);
  
  const {
    InputValue: phoneValue,
    showError: phoneShowError,
    onBlur: phoneOnBlur,
    onChangeValue: phoneOnChangeValue,
    isValid: phoneValid,
    onSubmit: phoneSubmit,
    reset: phonereset,
  } = useInput(phoneValidity);
  
  const {
    InputValue: resumeValue,
    showError: resumeShowError,
    onBlur: resumeOnBlur,
    onChangeValue: resumeOnChangeValue,
    isValid: resumeValid,
    onSubmit: resumeSubmit,
    reset: resumereset,
  } = useInput(URLValidity);
  
  const {
    InputValue: scgpaValue,
    showError: scgpaShowError,
    onBlur: scgpaOnBlur,
    onChangeValue: scgpaOnChangeValue,
    isValid: scgpaValid,
    onSubmit: scgpaSubmit,
    reset: scgpareset,
  } = useInput(scgpaValidation);
  
  const {
    InputValue: semesterValue,
    showError: semesterShowError,
    onBlur: semesterOnBlur,
    onChangeValue: semesterOnChangeValue,
    isValid: semesterValid,
    onSubmit: semesterSubmit,
    reset: semesterreset,
  } = useInput(semesterValidation);
  
  const {
    InputValue: batchValue,
    showError: batchShowError,
    onBlur: batchOnBlur,
    onChangeValue: batchOnChangeValue,
    isValid: batchValid,
    onSubmit: batchSubmit,
    reset: batchreset,
  } = useInput(checkValidity);
  
  const {
    InputValue: courseValue,
    showError: courseShowError,
    onBlur: courseOnBlur,
    onChangeValue: courseOnChangeValue,
    isValid: courseValid,
    onSubmit: courseSubmit,
    reset: coursereset,
  } = useInput(checkValidity);
  
  const {
    InputValue: passwordValue,
    showError: passwordShowError,
    onBlur: passwordOnBlur,
    onChangeValue: passwordOnChangeValue,
    isValid: passwordValid,
    onSubmit: passwordSubmit,
    reset: passwordreset,
  } = useInput(PasswordValidity);
  
  const confirmPasswordValidity = (password) => {
    return password === passwordValue;
  }

  const {
    InputValue: confirmPasswordValue,
    showError: confirmPasswordShowError,
    onBlur: confirmPasswordOnBlur,
    onChangeValue: confirmPasswordOnChangeValue,
    isValid: confirmPasswordValid,
    onSubmit: confirmPasswordSubmit,
    reset: confirmPasswordreset,
  } = useInput(confirmPasswordValidity);

  const html_batches = batches.map(element => {
    return <Dropdown.Item onClick={() => {batchOnChangeValue({target: {value: element}})}} key={element}>{element}</Dropdown.Item>
  })

  const createStudent = async (payload) => {
    console.log('sending request',payload);
    const data = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/student/signup`,
      data: payload
    });
    const token = data.data.data.token;
    const decoded_token = jwtDecode(token);
    cookies.set('jwt', token, {
      expires: new Date(decoded_token.exp * 1000)
    })
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
    nameSubmit();
    emailSubmit();
    phoneSubmit();
    enrollmentSubmit();
    resumeSubmit();
    scgpaSubmit();
    semesterSubmit();
    batchSubmit();
    courseSubmit();
    passwordSubmit();
    confirmPasswordSubmit();
    if (!confirmPasswordValid || !passwordValid || !batchValid || !semesterValid || !scgpaValid || !resumeValid
      || !phoneValid || !enrollmentValid || !nameValid || !emailValid || !courseValid) {
        return;
      }
    const registerStudent = {
      name: nameValue,
      email: emailValue,
      phone: phoneValue,
      enrollmentNo: enrollmentValue,
      resumeURL: resumeValue,
      scgpa: scgpaValue,
      semester: semesterValue,
      batch: batchValue,
      course: courseValue,
      password: passwordValue,
      confirmPassword: confirmPasswordValue
    }
    try {
    changeLoadingState(true);
    await createStudent(registerStudent);
    namereset();
    emailreset();
    phonereset();
    enrollmentreset();
    resumereset();
    scgpareset();
    semesterreset();
    batchreset();
    coursereset();
    passwordreset();
    confirmPasswordreset();
    dispatch(authActions.logInUser(false));
    changeLoadingState(false);
    return navigate('/');
    } catch (error) {
      changeLoadingState(false);
      if (error?.response?.data?.message) {
        changeErrorMsg(error.response.data.message);
      } else { changeErrorMsg(error.message); }
      setTimeout(() => {
        changeErrorMsg(undefined);
      }, 4000);
    }
  }

  return (
    <>
    {isLoading && <LoadingScreen/>}
    <div id='register-container'>
      <div id='register-card'>
        <Card style={{ width: '40rem' }} id='register-bootstrap-card'>
      <h3 id='register-heading'>Student Register</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" value={nameValue} required onChange={nameOnChangeValue} onBlur={nameOnBlur}/>
          </Form.Group>
          {nameShowError && <p className='error'>Please Enter your Name!!</p>}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Email" required value={emailValue} onChange={emailOnChangeValue} onBlur={emailOnBlur}/>
          </Form.Group>
          {emailShowError && <p className='error'>Please Enter a valid Email!!</p>}
          
          <Form.Group className="mb-3" controlId="formBasicEnrollmentNo">
            <Form.Label>Enrollment Number</Form.Label>
            <Form.Control type="text" placeholder="Enrollment No" required value={enrollmentValue} onChange={enrollmentOnChangeValue} onBlur={enrollmentOnBlur}/>
          </Form.Group>
          {enrollmentShowError && <p className='error'>Please Enter a valid Enrollment Number</p>}
          
          <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="number" placeholder="Phone No" required value={phoneValue} onChange={phoneOnChangeValue} onBlur={phoneOnBlur}/>
          </Form.Group>
          {phoneShowError && <p className='error'>Please Enter a valid Phone Number</p>}
          
          <Form.Group className="mb-3" controlId="formBasicResume">
            <Form.Label>Resume URL</Form.Label>
            <Form.Control type="text" placeholder="Resume URL" required value={resumeValue} onChange={resumeOnChangeValue} onBlur={resumeOnBlur}/>
          </Form.Group>
          {resumeShowError && <p className='error'>Please Enter a valid URL</p>}
          
          <Form.Group className="mb-3" controlId="formBasicCourse">
            <Form.Label>Course</Form.Label>
            <Form.Control type="text" placeholder="Course" required value={courseValue} onChange={courseOnChangeValue} onBlur={courseOnBlur}/>
          </Form.Group>
          {courseShowError && <p className='error'>Please Enter your Course</p>}
          
          <Form.Group className="mb-3" controlId="formBasicScgpa">
            <Form.Label>SCGPA</Form.Label>
            <Form.Control type="number" placeholder="SCGPA" required min={0} max={10} step={0.01} value={scgpaValue} onChange={scgpaOnChangeValue} onBlur={scgpaOnBlur}/>
          </Form.Group>
          {scgpaShowError && <p className='error'>Please Enter correct SCGPA!!</p>}
          
          <div className="group-batch">
            <Form.Group className="mb-3" controlId="formBasicSemester">
              <Form.Label>Semester</Form.Label>
              <Form.Control type="number" placeholder="Semester" required min={1} max={8} value={semesterValue} onChange={semesterOnChangeValue} onBlur={semesterOnBlur}/>
              {semesterShowError && <p className='error'>Please Enter correct semester!!</p>}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasicBatch">
              <Form.Label>Batch</Form.Label>
              <Dropdown id='batch'>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {batchValue === '' ? 'Batch': batchValue}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {html_batches}
                </Dropdown.Menu>
              </Dropdown>
              {batchShowError && <p className='error'>Please Enter your Batch!!</p>}
            </Form.Group>
          </div>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required value={passwordValue} onChange={passwordOnChangeValue} onBlur={passwordOnBlur}/>
          </Form.Group>
          {passwordShowError && <p className='error'>Password should be atleast 8 characters long!!</p>}
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required value={confirmPasswordValue} onChange={confirmPasswordOnChangeValue} onBlur={confirmPasswordOnBlur}/>
          </Form.Group>
          {confirmPasswordShowError && <p className='error'>Confirm Password should be same as password!!</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </Card>
      </div>
      <div className='already-acc'>
        <p>Already have a Account?</p>
        <NavLink to={'/student/login'}>
          <Button variant='secondary'>Log In</Button>
        </NavLink>
      </div>
      </div>
      {errorMsg && ReactDom.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
    </>
  )
}

export default RegisterPage
