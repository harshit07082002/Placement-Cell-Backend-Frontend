import React, { useEffect } from 'react'
import './PlacementDetails.css';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import LoadingScreen from '../Loader/LoadingScreen';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { Table, Button } from 'rsuite';
import ExitIcon from '@rsuite/icons/Exit';
import _ from 'lodash'
import ReactDom from 'react-dom';
import Error from '../Error/Error';
import { NavLink } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;
const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
      >
        <a href={rowData.resumeURL} target="_parent">Click Me</a>
      </Button>
    </Cell>
  );
};
const StudentActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
      >
        <NavLink to={`/student/${rowData.enrollmentNo}`}><ExitIcon/></NavLink>
      </Button>
    </Cell>
  );
};
const JobActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
      >
        <NavLink to={`/job/${rowData.job_id}`}><ExitIcon/></NavLink>
      </Button>
    </Cell>
  );
};

const studentFilter = (value, filter) => {
  if (value === '' || filter === '') {
    return true;
  }
  filter = filter.toLowerCase();
  if (filter.includes(value.enrollmentNo.toLowerCase()) || filter.includes(value.name.toLowerCase())
    || filter.includes(value.email.toLowerCase()) || filter.includes(value.batch) ||
      filter.includes(value.scgpa) || filter.includes(value.course.toLowerCase())) {
    return true;
  } else if (value.enrollmentNo.toLowerCase().includes(filter) || value.name.toLowerCase().includes(filter)
    || value.email.toLowerCase().includes(filter) || value.course.toLowerCase().includes(filter)) {
    return true;
  } else {
    return false;
  }
}
const jobFilter = (value, filter) => {
  if (value === '' || filter === '') {
    return true;
  }
  filter = filter.toLowerCase();
  if (filter.includes(value.job_id.toLowerCase() || filter.includes(value.company.toLowerCase()))
    || filter.includes(value.package) || filter.includes(value.job_desc.toLowerCase()) || filter.includes(value.requirements.toLowerCase())
    || filter.includes(value.scgpa_req)) {
    return true;
  } else if(value.job_id.toLowerCase().includes(filter) || value.company.toLowerCase().includes(filter)
    || value.job_desc.toLowerCase().includes(filter) || value.requirements.toLowerCase().includes(filter)) {
    return true;
  } else {
    return false;
  }
}

const PlacementDetails = () => {
  const [inputSearch, changeInputSearch] = useState('');
  const [isStudentSelected, changeSelection] = useState(true);
  const [isLoading, changeLoadingState] = useState(false);
  const selectedClass = 'placement-navBar-selected';
  const [details, changeDetails] = useState([]);
  const [filteredDetails, changeFilteredDetails] = useState([]);
  const [errorMsg, changeErrorMsg] = useState(undefined);

  const getStudentsDetails = async () => {
    const cookies = new Cookies();
    const token = cookies.get('jwt');
    const data = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/admin/get-all-students`,
      headers: {
      'Authorization': `token ${token}`
      }
    })
    return data.data.students;
  }
  
  const getJobsDetails = async () => {
    const cookies = new Cookies();
    const token = cookies.get('jwt');
    const data = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/job`,
      headers: {
      'Authorization': `token ${token}`
      }
    })
    return data.data.data;
  }

  const getDetails = async () => {
    changeLoadingState(true);
    let detail = [];
    if (isStudentSelected) {
      detail = await getStudentsDetails();
    } else {
      detail = await getJobsDetails();
    }
    changeDetails(detail);
    changeFilteredDetails(detail);
  }
  
  useEffect(() => {
    getDetails()
    .then(() => {
      changeLoadingState(false);
    })
    .catch(error => {
      changeLoadingState(false);
      if (error?.response?.data?.message) {
        changeErrorMsg(error.response.data.message);
      } else { changeErrorMsg(error.message); }
      setTimeout(() => {
        changeErrorMsg(undefined);
      }, 4000);
    })
  }, [isStudentSelected])

  useEffect(() => {
    let data = _.cloneDeep(details);
    let change = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].batch && Array.isArray(data[i].batch)) {
        let str = '';
        data[i].batch.forEach((element, index) => {
          if (index != data[i].batch.length - 1) {
            str += element;
            str += ', ';
          } else {
            str += element;
          }
        });
        data[i].batch = str;
        change = true;
      }
    }
    if (change) {
      changeDetails(data);
      changeFilteredDetails(data);
    }
  }, [details])

  const searchDetails = (e) => {
    changeInputSearch(e);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const data = [];
      if (inputSearch === null || inputSearch === '') {
        return;
      }
      details.forEach((element) => {
        if (isStudentSelected && studentFilter(element, inputSearch)) {
          data.push(element);
        } else if (!isStudentSelected && jobFilter(element, inputSearch)) {
          data.push(element);
        }
      })
      console.log(data,inputSearch);
      changeFilteredDetails(data);
    }, 500);
    return () => {
      clearTimeout(timeout);
    }
  }, [inputSearch])

  return (
    <div>
      {isLoading && <LoadingScreen/>}
      {errorMsg && ReactDom.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
      <div className='placement-navBar'>
        <Card className={isStudentSelected && selectedClass} onClick={()=>{changeSelection(true)}}>Students</Card>
        <Card className={!isStudentSelected && selectedClass} onClick={()=>{changeSelection(false)}}>Jobs</Card>
      </div>
      <InputGroup className='placementDetailsSearch'>
        <Input placeholder='Search' onChange={searchDetails} value={inputSearch} />
        <InputGroup.Addon>
          <SearchIcon />
        </InputGroup.Addon>
      </InputGroup>
      {isStudentSelected &&
        <div className='one'>
          <Table virtualized data={filteredDetails} className='placement-details-table' onClick={(e)=>{console.log(e)}}>
            <Column width={60} align="center" fixed>
              <HeaderCell>#</HeaderCell>
              <StudentActionCell/>
            </Column>
            <Column width={200} align="center" fixed>
              <HeaderCell>Enrollment No</HeaderCell>
              <Cell dataKey="enrollmentNo" />
            </Column>

            <Column width={200}>
              <HeaderCell>Name</HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column width={250}>
              <HeaderCell>Email</HeaderCell>
              <Cell dataKey="email" />
            </Column>

            <Column width={180}>
              <HeaderCell>Batch</HeaderCell>
              <Cell dataKey="batch" />
            </Column>

            <Column width={180}>
              <HeaderCell>CGPA</HeaderCell>
              <Cell dataKey="scgpa" />
            </Column>

            <Column width={180}>
              <HeaderCell>Course</HeaderCell>
              <Cell dataKey="course" />
            </Column>
            <Column width={210}>
              <HeaderCell>Resume</HeaderCell>
              <ActionCell dataKey="resumeURL" />
            </Column>
          </Table>
        </div>
      }
      {!isStudentSelected && <div className='one'>
          <Table virtualized data={filteredDetails} className='placement-details-table' onClick={(e)=>{console.log(e)}}>
            <Column width={60} align="center" fixed>
              <HeaderCell>#</HeaderCell>
              <JobActionCell/>
            </Column>
            
            <Column width={250} align="center" fixed>
              <HeaderCell>Job Id</HeaderCell>
              <Cell dataKey="job_id" />
            </Column>

            <Column width={230}>
              <HeaderCell>Company</HeaderCell>
              <Cell dataKey="company" />
            </Column>

            <Column width={220}>
              <HeaderCell>Job Desc</HeaderCell>
              <Cell dataKey="job_desc" />
            </Column>

            <Column width={220}>
              <HeaderCell>Requirements</HeaderCell>
              <Cell dataKey="requirements" />
            </Column>

            <Column width={200}>
              <HeaderCell>Package</HeaderCell>
              <Cell dataKey="package" />
            </Column>

            <Column width={200}>
              <HeaderCell>CGPA Req.</HeaderCell>
              <Cell dataKey="scgpa_req" />
            </Column>

            <Column width={200}>
              <HeaderCell>Batch Eligible</HeaderCell>
              <Cell dataKey="batch" />
            </Column>
          </Table>
        </div>}
    </div>
  )
}

export default PlacementDetails
