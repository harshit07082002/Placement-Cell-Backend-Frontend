import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import './AdminHomePage.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from 'axios';
import Cookies from 'universal-cookie';
import LoadingScreen from '../Loader/LoadingScreen';

const AdminHomePage = () => {
  const [stats, changeStats] = useState({registered_students: undefined, placement_coordinators: undefined,
    average_package: undefined, highest_package: undefined, lowest_package: undefined, average_package: undefined, students_placed: 0});
  const [isLoading, changeLoadingState] = useState(false);

  const calculateStats = async () => {
    const cookies = new Cookies();
    const token = cookies.get('jwt');
    const data = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/admin/get-all-students`,
      headers: {
      'Authorization': `token ${token}`
      }
    })
    const registered_students = data.data.length;
    let students_placed = 0;
    data.data.students.forEach(element => {
      let placed = false;
      element.companies.forEach(student => {
        if (student.status === 'Selected') {
          placed = true;
        }
      });
      if (placed) {
        students_placed++;
      }
    });
    students_placed*=100;
    students_placed/=registered_students;
    console.log(students_placed, registered_students);
    changeStats(state => {
      return {registered_students,students_placed};
    })
  }

  useEffect(() => {
    changeLoadingState(true);
    calculateStats().then(()=>{
      changeLoadingState(false);
      console.log('done');
    }).catch(error => {
      changeLoadingState(false);
    }) 
  }, [])
  return (
    <div> 
      {isLoading && <LoadingScreen/>} 
      <h3 className='adminPageHeading'>Placement Statistics</h3>
      <div className='statistics'>
        <Card className="details-container">
          <h5>Registered Students</h5>
          <h6>{stats.registered_students}</h6>
        </Card>
        <Card className="details-container">
          <h5>Placement Coordinators</h5>
          <h6>1000</h6>
        </Card>
        <Card className="details-container">
          <h5>Average Package</h5>
          <h6>₹ 10 LPA</h6>
        </Card>
        <Card className="details-container">
          <h5>Highest Package</h5>
          <h6>₹ 10 LPA</h6>
        </Card>
        <Card className="details-container">
          <h5>Lowest Package</h5>
          <h6>₹ 10 LPA</h6>
        </Card>
        <Card className="details-container">
          <h5>Students Placed</h5>
        <CircularProgressbar 
                value={stats.students_placed}
                className='circular-bar'
                maxValue={100}
                text={`${stats.students_placed}%`}
                styles={buildStyles({
                    pathColor: stats.students_placed < 50 ? "red" : stats.students_placed < 80 ? "orange" : "green",
                })}
            />
        </Card>
      </div>
    </div>
  )
}

export default AdminHomePage
