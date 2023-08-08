import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import ExitIcon from '@rsuite/icons/Exit';
import { Table, Button as Button2 } from 'rsuite';
import company from '../../image/default-company.png'
import LoadingScreen from '../Loader/LoadingScreen';
import { useState } from 'react';
import ReactDom from 'react-dom';
import Error from '../Error/Error';
import { Card, Button } from 'react-bootstrap';
import './JobDetails.css';

const { Column, HeaderCell, Cell } = Table;

const StudentActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button2
        appearance="link"
      >
        <NavLink to={`/student/${rowData.enrollment_no}`}><ExitIcon/></NavLink>
      </Button2>
    </Cell>
  );
};

const JobDetails = () => {
  const {jobid} = useParams();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const auth = useSelector(state => state.auth);
  const [errorMsg, changeErrorMsg] = useState(undefined);
  const [isLoading, changeLoadingState] = useState(false);
  const [jobData, changeJobData] = useState({});
  const [successHandler, ChangesuccessHandler] = useState(undefined);
  const [dataChanged, changeData] = useState(true);

  const selectCandidate = async (data) => {
    try {
      changeLoadingState(true);
      const cookies = new Cookies();
      const token = cookies.get('jwt');
      const payload = {
        enrollmentNo: data.enrollment_no,
        job_id: jobid,
        status: 'Selected'
      };
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BACKEND}/api/v1/apply/update`,
        data: payload,
        headers: {
        'Authorization': `token ${token}`
        }
      });
      changeLoadingState(false);
      changeData(state => {return !state;});
    } catch (error) {
      errorHandler(error);
    }
  }

  const rejectCandidate = async (data) => {
    try {
      changeLoadingState(true);
      const cookies = new Cookies();
      const token = cookies.get('jwt');
      const payload = {
        enrollmentNo: data.enrollment_no,
        job_id: jobid,
        status: 'Rejected'
      };
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BACKEND}/api/v1/apply/update`,
        data: payload,
        headers: {
        'Authorization': `token ${token}`
        }
      });
      changeLoadingState(false);
      changeData(state => {return !state;});
    } catch (error) {
      errorHandler(error);
    }
  }

  const StatusActionCell = ({ rowData, dataKey, onClick, ...props }) => {
    let element;
    if (rowData.status === 'Under Review') {
      element = <>
        <Button2 appearance='link' onClick={async() => {await selectCandidate(rowData)}}>Select Candidate</Button2>
        <Button2 appearance='link' onClick={async() => {await rejectCandidate(rowData)}}>Reject Candidate</Button2>
      </>;
    } else if (rowData.status === 'Selected') {
      element = <>
        <Button2 appearance='link' onClick={async() => {await rejectCandidate(rowData)}}>Reject Candidate</Button2>
      </>
    } else {
      element = <>
        <Button2 appearance='link' onClick={async() => {await selectCandidate(rowData)}}>Select Candidate</Button2>
      </>
    }
    return (
      <Cell {...props} style={{display: 'flex', flexDirection: 'column'}}>
        {element}
      </Cell>
    );
  };

  const errorHandler = (error) => {
    changeLoadingState(false);
    if (error?.response?.data?.message) {
      changeErrorMsg(error.response.data.message);
    } else { changeErrorMsg(error.message); }
    setTimeout(() => {
      changeErrorMsg(undefined);
    }, 4000);
  }

  const getJobDetails = async () => {
    changeLoadingState(true);
    const cookies = new Cookies();
    const token = cookies.get('jwt');
    const data = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/job/${jobid}`,
      headers: {
      'Authorization': `token ${token}`
      }
    })
    return data.data.data[0];
  }

  useEffect(() => {
    getJobDetails()
    .then((data) => {
      console.log(data);
      changeJobData(data);
      changeLoadingState(false);
    })
    .catch((error) => {
      errorHandler(error);
    });
  }, [dataChanged]);

  const getUserDetails = async () => {
    changeLoadingState(true);
    const token = cookies.get('jwt');
    const decoded_token = jwtDecode(token);
    const payload = {
      id: decoded_token.id
    }
    const url = `${process.env.REACT_APP_BACKEND}/api/v1/student/`;
    const data = await axios({
      method: "POST",
      url,
      headers: {
      'Authorization': `token ${token}`
      },
      data: payload
    })
    return data.data.admin;
  }

  const applyJob = async () => {
    try {
      changeLoadingState(true);
      const cookies = new Cookies();
      const token = cookies.get('jwt');
      const data2 = await getUserDetails();
      console.log(data2);
      const payload = {
        enrollmentNo: data2.enrollmentNo,
        job_id: jobid
      }
      const data = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BACKEND}/api/v1/apply/`,
        headers: {
        'Authorization': `token ${token}`
        },
        data: payload
      })
      ChangesuccessHandler('Successfully Registered for the Job');
      setTimeout(() => {
        ChangesuccessHandler(undefined);
      }, 4000);
    } catch(error) {
      errorHandler(error);
    } finally {
      changeLoadingState(false);
    }
  }

  const Success = (props) => {
    return (
      <div className='success-message'>
        {props.message}
      </div>
    )
  }

  return (
    <>
      {isLoading && <LoadingScreen/>}
      {errorMsg && ReactDom.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
      {successHandler && ReactDom.createPortal(<Success message={successHandler}/>, document.getElementById('error-overlay'))}
      <div>
        <Card className='info-card'>
          <div className="name">
            <img src={company} id='profile-photo' alt="photo" />
            <div className="data">
              <h1>{jobData?.company}</h1>
              <p>Job Id: {jobData?.job_id}</p>
            </div>
          </div>
            <div className="contain mt-4">
              <h6>Package:</h6>
              <p>{jobData?.package} LPA</p>
            </div>
            <hr />
             <div className="contain">
              <h6>Job Description:</h6>
              <p>{jobData?.job_desc}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>Job Requirements:</h6>
              <p>{jobData?.requirements}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>Min CGPA Required:</h6>
              <p>{jobData?.scgpa_req}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>Batch Eligible:</h6>
              <div style={{display:'flex', alignItems:'center', textAlign:'center'}}>
                {jobData?.batch?.map(element => {
                  return <div style={{marginRight:'0.5rem'}}>{element}</div>
                })}
              </div>
            </div>
            <hr />
            {auth.isAdmin && <div >
              <h5 style={{marginTop:'1rem', marginBottom:'1rem'}}>Students Applied:</h5>
                <Table virtualized data={jobData.applied} style={{marginLeft:'auto',marginRight:'auto'}}>
                  <Column width={60} align="center" fixed>
                    <HeaderCell>#</HeaderCell>
                    <StudentActionCell/>
                  </Column>
                  
                  <Column width={200} align="center" fixed>
                    <HeaderCell>Enrollment No</HeaderCell>
                    <Cell dataKey="enrollment_no" />
                  </Column>

                  <Column width={300} align='center'>
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey="name" />
                  </Column>

                  <Column width={300} align='center'>
                    <HeaderCell>Status</HeaderCell>
                    <Cell dataKey="status" />
                  </Column>
                  <Column width={300} align='center'>
                    <HeaderCell>Change Status</HeaderCell>
                    <StatusActionCell/>
                  </Column>
                </Table>
            </div>}
            {!auth.isAdmin && <div >
                <Button style={{marginTop:'1rem'}} onClick={applyJob}>Apply</Button>
            </div>}
        </Card>
      </div>
    </>
  )
}

export default JobDetails
