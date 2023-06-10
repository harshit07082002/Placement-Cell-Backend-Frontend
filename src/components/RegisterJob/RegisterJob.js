import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useInput from '../../hooks/use-input';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'universal-cookie';
import ReactDom from 'react-dom';
import Error from '../../components/Error/Error';
import LoadingScreen from '../../components/Loader/LoadingScreen';
import './RegisterJob.css';


const checkValidity = (value) => {
  if (value == '') {
    return false;
  } else {
    return true;
  }
}

const textValidity = (value) => {
  return value.trim().length >= 10
}

const scgpaValidation = (scgpa) => {
  return scgpa <= 10;
}


const RegisterJob = () => {
  const [errorMsg, changeErrorMsg] = useState(undefined);
  const [isLoading, changeLoadingState] = useState(false);
  const cur_year = new Date().getFullYear();
  const batches = [cur_year, cur_year + 1, cur_year + 2];
  const [batchError, changeBatchError] = useState(false);
  const [batchSelected, changeBatchSelected] = useState([false, false, false]);
  const selectedClass = 'batch-year selected-year';
  const unSelectedClass = 'batch-year';
  const cookies = new Cookies();
  const {
    InputValue: jobValue,
    showError: jobShowError,
    onBlur: jobOnBlur,
    onChangeValue: jobOnChangeValue,
    isValid: jobValid,
    onSubmit: jobSubmit,
    reset: jobreset,
  } = useInput(checkValidity);

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
    InputValue: packageValue,
    showError: packageShowError,
    onBlur: packageOnBlur,
    onChangeValue: packageOnChangeValue,
    isValid: packageValid,
    onSubmit: packageSubmit,
    reset: packagereset,
  } = useInput(checkValidity);
  
  const {
    InputValue: descValue,
    showError: descShowError,
    onBlur: descOnBlur,
    onChangeValue: descOnChangeValue,
    isValid: descValid,
    onSubmit: descSubmit,
    reset: descreset,
  } = useInput(textValidity);
  
  const {
    InputValue: requirementsValue,
    showError: requirementsShowError,
    onBlur: requirementsOnBlur,
    onChangeValue: requirementsOnChangeValue,
    isValid: requirementsValid,
    onSubmit: requirementsSubmit,
    reset: requirementsreset,
  } = useInput(textValidity);
  
  const {
    InputValue: scgpaValue,
    showError: scgpaShowError,
    onBlur: scgpaOnBlur,
    onChangeValue: scgpaOnChangeValue,
    isValid: scgpaValid,
    onSubmit: scgpaSubmit,
    reset: scgpareset,
  } = useInput(scgpaValidation);

  const updateBatch = (year) => {
    changeBatchError(false);
    changeBatchSelected(state => {
      const ar = [...state];
      ar[year] = !ar[year];
      return ar;
    })
  }

  const createJob = async (payload) => {
    const token = cookies.get('jwt');
    const data = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/job`,
      data: payload,
      headers: {
        'Authorization': `token ${token}`
      }
    });
    return data;
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
    nameSubmit();
    jobSubmit();
    descSubmit();
    packageSubmit();
    requirementsSubmit();
    scgpaSubmit();
    const batch = [];
    batchSelected.forEach((el, index) => {
      if (el) {
        batch.push(batches[index]);
      }
    })
    if (batch.length == 0) {
      changeBatchError(true);
    }
    if (!scgpaValid || !requirementsValid || !descValid || !packageValid || !nameValid || !jobValid || batch.length == 0) {
        return;
    }
    const registerJob = {
      company: nameValue,
      job_id: jobValue,
      job_desc: descValue,
      package: packageValue,
      requirements: requirementsValue,
      scgpa_req: scgpaValue,
      batch
    }
    try {
    changeLoadingState(true);
    await createJob(registerJob);
    namereset();
    jobreset();
    descreset();
    packagereset();
    requirementsreset();
    scgpareset();
    changeLoadingState(false);
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
    <div id='register-container' className='job-register'>
      <div id='register-card'>
        <Card style={{ width: '40rem' }} id='register-bootstrap-card'>
      <h3 id='register-heading'>Job Register</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" placeholder="Company Name" value={nameValue} required onChange={nameOnChangeValue} onBlur={nameOnBlur}/>
            {nameShowError && <p className='error'>Please Enter Company Name</p>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicjob">
            <Form.Label>Job ID</Form.Label>
            <Form.Control type="text" placeholder="Job id" required value={jobValue} onChange={jobOnChangeValue} onBlur={jobOnBlur}/>
            {jobShowError && <p className='error'>Please Enter Job Id</p>}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formBasicPackageNo">
            <Form.Label>Package (CTC)</Form.Label>
            <Form.Control type="number" placeholder="Package" required value={packageValue} onChange={packageOnChangeValue} onBlur={packageOnBlur}/>
            {packageShowError && <p className='error'>Please Enter CTC</p>}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formBasicDescNumber">
            <Form.Label>Job Description</Form.Label>
            <textarea class="form-control" id="form4Example3" placeholder='Job Description' rows="4" required value={descValue} onChange={descOnChangeValue} onBlur={descOnBlur}></textarea>
            {descShowError && <p className='error'>Job Desc should be atleast 10 characters long</p>}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formBasicRequirements">
            <Form.Label>Requirements</Form.Label>
            <textarea class="form-control" id="form4Example3" placeholder='Requirements' rows="4" required value={requirementsValue} onChange={requirementsOnChangeValue} onBlur={requirementsOnBlur}></textarea>
            {requirementsShowError && <p className='error'>Requirements should be atleast 10 characters long</p>}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formBasicScgpa">
            <Form.Label>Required SCGPA</Form.Label>
            <Form.Control type="number" placeholder="Required SCGPA" required min={0} max={10} step={0.01} value={scgpaValue} onChange={scgpaOnChangeValue} onBlur={scgpaOnBlur}/>
            {scgpaShowError && <p className='error'>Please Enter correct SCGPA!!</p>}
          </Form.Group>
          
          <div className="group-batch">
            <Form.Group className="mb-3" controlId="formBasicBatch">
              <Form.Label>Batch Eligible</Form.Label>
              <div className="group-batch">
              <div className={batchSelected[0]?selectedClass:unSelectedClass} onClick={()=>{updateBatch(0)}}>{batches[0]}</div>
              <div className={batchSelected[1]?selectedClass:unSelectedClass} onClick={()=>{updateBatch(1)}}>{batches[1]}</div>
              <div className={batchSelected[2]?selectedClass:unSelectedClass} onClick={()=>{updateBatch(2)}}>{batches[2]}</div>
              </div>
              {batchError && <p className='error'>Please select Batch</p>}
            </Form.Group>
          </div>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </Card>
      </div>
    </div>
      {errorMsg && ReactDom.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
    </>
  )
}

export default RegisterJob
