import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { NavLink } from 'react-router-dom';
import ExitIcon from '@rsuite/icons/Exit';
import { Table, Button as Button2 } from 'rsuite';
import LoadingScreen from '../Loader/LoadingScreen';
import { useState } from 'react';
import ReactDom from 'react-dom';
import Error from '../Error/Error';
import { Card, Button } from 'react-bootstrap';
import './StudentDetails.css';

const { Column, HeaderCell, Cell } = Table;

const JobActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button2
        appearance="link"
      >
        <NavLink to={`/job/${rowData.jobid}`}><ExitIcon/></NavLink>
      </Button2>
    </Cell>
  );
};

const StudentDetails = () => {
  const {enrollmentNo} = useParams();
  const [errorMsg, changeErrorMsg] = useState(undefined);
  const [isLoading, changeLoadingState] = useState(false);
  const [studentData, changeStudentData] = useState({});
  const [dataChanged, changeData] = useState(true);

  const errorHandler = (error) => {
    changeLoadingState(false);
    if (error?.response?.data?.message) {
      changeErrorMsg(error.response.data.message);
    } else { changeErrorMsg(error.message); }
    setTimeout(() => {
      changeErrorMsg(undefined);
    }, 4000);
  }

  const getStudentDetails = async () => {
    changeLoadingState(true);
    const cookies = new Cookies();
    const token = cookies.get('jwt');
    const data = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/admin/get-student/${enrollmentNo}`,
      headers: {
      'Authorization': `token ${token}`
      }
    })
    console.log(data);
    return data.data.students;
  }

  const selectCandidate = async (data) => {
    try {
      changeLoadingState(true);
      const cookies = new Cookies();
      const token = cookies.get('jwt');
      const payload = {
        enrollmentNo,
        job_id: data.jobid,
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
        enrollmentNo,
        job_id: data.jobid,
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

  useEffect(() => {
    getStudentDetails()
    .then((data) => {
      changeStudentData(data);
      changeLoadingState(false);
    })
    .catch((error) => {
      errorHandler(error);
    });
  }, [dataChanged]);

  return (
    <>
      {isLoading && <LoadingScreen/>}
      {errorMsg && ReactDom.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
      <div>
        <Card className='info-card'>
          <div className="name">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" id='profile-photo' alt="photo" />
            <div className="data">
              <h1>{studentData?.name}</h1>
              <p>{studentData?.enrollmentNo}</p>
            </div>
          </div>
            <div className="contain mt-4">
              <h6>Phone:</h6>
              <p>{studentData?.phone}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>Email:</h6>
              <p>{studentData?.email}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>Batch:</h6>
              <p>{studentData?.batch}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>Course:</h6>
              <p>{studentData?.course}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>CGPA:</h6>
              <p>{studentData?.scgpa}</p>
            </div>
            <hr />
            <div className="contain">
              <h6>Resume:</h6>
              <Button href='https://mail.google.com/mail/u/0/#inbox' target='_blank'>Click Me</Button>
            </div>
            <hr />
            <div >
              <h5 style={{marginTop:'1rem', marginBottom:'1rem'}}>Applied Jobs:</h5>
                <Table  autoHeight data={studentData.companies} style={{marginLeft:'auto',marginRight:'auto'}}>
                  <Column width={60} align="center" fixed>
                    <HeaderCell>#</HeaderCell>
                    <JobActionCell/>
                  </Column>
                  
                  <Column width={200} align="center" fixed>
                    <HeaderCell>Job Id</HeaderCell>
                    <Cell dataKey="jobid" />
                  </Column>

                  <Column width={310} align='center'>
                    <HeaderCell>Company Name</HeaderCell>
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
            </div>
        </Card>
      </div>
    </>
  )
}

export default StudentDetails
