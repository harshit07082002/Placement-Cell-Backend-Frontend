import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import image from '../../image/svg-previa.webp';
import image1 from '../../image/Procurement-hero.svg'
import image2 from '../../image/image2.webp'
import './HomePage.css';
import Button from 'react-bootstrap/Button';
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import StudentHomePage from '../../components/StudentHomePage/StudentHomePage';
import AdminHomePage from '../../components/AdminHomePage/AdminHomePage';

const HomePage = () => {
  const auth = useSelector(state => state.auth);
  return (
    <>
      {!auth.isLogin && <div id='home-container'>
        <img src={image} alt="placement cell" id='front-image'/>
        <div id='placement-heading'>
        <h1>WELCOME TO </h1><h1 id='placement-heading-right'>CareerCrest</h1>
        </div>
        <h5>We Will Support You In You Entire Placement Journey</h5>
        <div className="cards">
          <Card style={{ width: '20rem', marginBottom: '7rem', marginTop: '1rem' }} id='student-card'>
            <Card.Img variant="top" src={image2} id='image'/>
            <Card.Body>
              <p id='are-you'>Are you a</p>
              <Card.Title>Student?</Card.Title>
              <Card.Text>
                Existing Students can login with their credentials. New Students can register
              </Card.Text>
              <NavLink to={'/student/login'}><Button variant="primary">Login/Register</Button></NavLink>
            </Card.Body>
          </Card>
          <Card style={{ width: '20rem', marginBottom: '7rem', marginTop: '1rem'}} id='admin-card'>
            <Card.Img variant="top" src={image1} id='image'/>
            <Card.Body>
              <p id='are-you'>Are you from the</p>
              <Card.Title>Placement Cell?</Card.Title>
              <Card.Text>
                Placement coordinator can login to their account from here
              </Card.Text>
              <NavLink to={'/admin/login'}><Button variant="primary">Login/Register</Button></NavLink>
            </Card.Body>
          </Card>
        </div>
      </div>}
      {auth.isLogin && auth.isAdmin && <AdminHomePage/>}
      {auth.isLogin && !auth.isAdmin && <StudentHomePage/>}
    </>
  )
}

export default HomePage
