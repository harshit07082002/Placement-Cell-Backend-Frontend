import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import SignOut from '@rsuite/icons/legacy/SignOut'
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import DetailIcon from '@rsuite/icons/Detail';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import './StudentNavBar.css'
import { authActions } from '../../store/authSlice';

import 'rsuite/dist/rsuite.min.css';

const styles = {
  width: 200,
  display: 'inline-table',
  marginRight: '2rem',
};

const StudentNavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [activeKey, setActiveKey] = useState('1');
  const [openKeys, setOpenKeys] = useState(['3', '4']);
  const [expanded, setExpand] = useState(true);
  useEffect(() => {
    const url = window.location.pathname;
    if (url === '/profile') {
      setActiveKey('3');
    } else if (url === '/') {
      setActiveKey('1');
    }
    else if (url === '/applied-jobs') {
      setActiveKey('2');
    }
  }, [])

  const logoutHandler = () => {
    cookies.remove('jwt');
    dispatch(authActions.logOutUser());
  }

  return (
    <>
      <div id='navbar-card' style={styles}>
        <Sidenav
          appearance='default'
          expanded={expanded}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          id='sidenav'
        >
        <Sidenav.Body>
          <Nav className='nav-item' onExpand={setExpand} onSelect={setActiveKey} activeKey={activeKey}>
            <Nav.Item eventKey="1" onClick={() => navigate('/')} icon={<DashboardIcon />}>
              Available Jobs
            </Nav.Item>
            <Nav.Item eventKey="2" onClick={() => navigate('/applied-jobs')} icon={<GroupIcon />}>
              Applied Jobs
            </Nav.Item>
            <Nav.Item eventKey="3" onClick={() => navigate('/profile')} icon={<UserBadgeIcon />}>
              Profile
            </Nav.Item>
            <Nav.Item eventKey="4" onClick={logoutHandler} icon={<SignOut />}>
              Logout
            </Nav.Item>
          </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
    </>
  );
};

export default StudentNavBar;