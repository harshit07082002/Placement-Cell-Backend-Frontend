import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { Button } from 'rsuite';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import "./ProfilePage.css";
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import ReactDOM from 'react-dom'
import Error from '../../components/Error/Error';
import LoadingScreen from '../../components/Loader/LoadingScreen';

const ProfilePage = () => {
  const auth = useSelector(state => state.auth);
  let url = `${process.env.REACT_APP_BACKEND}/api/v1/admin/`;
  const [isLoading, changeLoadingState] = useState(false);
  const [errorMsg, changeErrorMsg] = useState(undefined);
  const [adminData, changeAdminData] = useState({});
  const cookies = new Cookies();
  if(!auth.isAdmin) {
    url = `${process.env.REACT_APP_BACKEND}/api/v1/student/`
  }
  const errorHandler = (error) => {
    changeLoadingState(false);
    if (error?.response?.data?.message) {
      changeErrorMsg(error.response.data.message);
    } else { changeErrorMsg(error.message); }
    setTimeout(() => {
      changeErrorMsg(undefined);
    }, 4000);
  }

  const getAdminDetails = async () => {
    changeLoadingState(true);
    const token = cookies.get('jwt');
    const decoded_token = jwtDecode(token);
    const payload = {
      id: decoded_token.id
    }
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

  useEffect(() => {
    getAdminDetails()
    .then((data) => {
      changeAdminData(data);
      changeLoadingState(false);
    })
    .catch((error) => {
      errorHandler(error);
    });
  }, []);

  return (
    <>
        {isLoading && <LoadingScreen/>} 
        {errorMsg && ReactDOM.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
        <Card id='profile-card'>
          <div className="container-2">
            <div id='combine'>
              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="" />
              <div className="profile-container">
                <h3>Profile</h3>
                <h5>Update you Personal Details.</h5>
              </div>
            </div>
            <Button id='save-button'>Save</Button>
          </div>
          <hr />
          <div className='contain-item'>
            <h4>Name :</h4>
            <input type="text" name="" className="in" value={adminData.name}/>
          </div>
          <div className='contain-item'>
            <h4>Email :</h4>
            <input type="text" name="" className="in" value={adminData.email} disabled/>
          </div>
          <div className='contain-item'>
            <h4>Mobile :</h4>
            <input type="text" name="" className="in" value={adminData.phone}/>
          </div>
          <div className='contain-item'>
            <h4>Password :</h4>
            <input type="password" name="" className="in" />
          </div>
          <div className='contain-item'>
            <h4>Confirm Password :</h4>
            <input type="password" name="" className="in" />
          </div>
        </Card>
    </>
  )
}

export default ProfilePage
