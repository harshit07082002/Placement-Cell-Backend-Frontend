import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import SignOut from '@rsuite/icons/legacy/SignOut'
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import DetailIcon from '@rsuite/icons/Detail';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './AdminNavBar.css'

import 'rsuite/dist/rsuite.min.css';

const styles = {
  width: 200,
  display: 'inline-table',
  marginRight: '2rem',
};

const AdminNavBar = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('1');
  const [openKeys, setOpenKeys] = useState(['3', '4']);
  const [expanded, setExpand] = useState(true);
  useEffect(() => {
    const url = window.location.pathname;
    if (url === '/register-job') {
      setActiveKey('3');
    } else if (url === '/placement-details') {
      setActiveKey('4');
    }
  }, [])
  
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
              Dashboard
            </Nav.Item>
            <Nav.Item eventKey="2" onClick={() => navigate('/profile')} icon={<GroupIcon />}>
              Profile
            </Nav.Item>
            <Nav.Item eventKey="3" onClick={() => navigate('/register-job')} icon={<UserBadgeIcon />}>
              Register Job
            </Nav.Item>
            <Nav.Item eventKey="4" onClick={() => navigate('/placement-details')} icon={<DetailIcon />}>
              Placement Details
            </Nav.Item>
            <Nav.Item eventKey="5" icon={<SignOut />}>
              Logout
            </Nav.Item>
          </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
    </>
  );
};

export default AdminNavBar;