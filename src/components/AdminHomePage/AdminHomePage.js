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
  const [minPackage, changeMinPackage] = useState(Number.MAX_VALUE);
  const [maxPackage, changeMaxPackage] = useState(Number.MIN_VALUE);
  const [avgPackage, changeAvgPackage] = useState(0);
  let noOfPackages = 0;

  const calculatePackageDetails = (CTC) => {
    changeMinPackage(Math.min(minPackage, CTC));
    changeMaxPackage(Math.max(maxPackage, CTC));
    changeAvgPackage(state => {
      let x = state;
      x *= noOfPackages;
      x += CTC;
      noOfPackages++;
      x /= noOfPackages;
      return x;
    });
  }

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
    const student = data.data.students;
    for (let i = 0; i < student.length; i++) {
      let placed = false;
      for (let j = 0; j < student[i].companies.length; j++) {
        if (student[i].companies[j].status === 'Selected') {
          console.log('h');
          placed = true;
          calculatePackageDetails(student[i].companies[j].ctc);
        }
      }
      if (placed) {
        students_placed++;
      }
    }
    students_placed*=100;
    students_placed/=registered_students;
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
          <h6>₹ {avgPackage} LPA</h6>
        </Card>
        <Card className="details-container">
          <h5>Highest Package</h5>
          {maxPackage!==Number.MIN_VALUE && <h6>₹ {maxPackage} LPA</h6>}
          {maxPackage===Number.MIN_VALUE && <h6>₹ ---</h6>}
        </Card>
        <Card className="details-container">
          <h5>Lowest Package</h5>
          {minPackage!==Number.MAX_VALUE && <h6>₹ {minPackage} LPA</h6>}
          {minPackage===Number.MAX_VALUE && <h6>₹ ---</h6>}
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
