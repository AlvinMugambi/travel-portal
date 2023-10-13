import React, { useState, useMemo, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

import StyledText from '../../Components/Common/StyledText';
import Trips from './Trips';
import Settings from './Settings';
import { UserData } from '../../State/atoms/auth';
import { capitalizeFLetter } from '../../Utils/helpers';

const menus = [
  {
    title: 'Dashboard',
    icon: require('../../Assets/Images/store.png'),
    name: 'dashboard',
    component: <Trips />,
  },
  {
    title: 'Settings',
    icon: require('../../Assets/Images/settings.png'),
    name: 'settings',
    component: <Settings />,
  },
];

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const userData = useRecoilValue(UserData);
  const navigate = useNavigate();

  const activeDisplay = useMemo(() => {
    return menus.find((menu) => menu.name === activeMenu);
  }, [menus, activeMenu]);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/Login');
    }
  }, [userData]);

  return (
    <div style={styles.flex}>
      <div style={styles.drawer}>
        <div style={styles.flexCenter}>
          <img
            src={require('../../Assets/Images/travel-tech-logo.png')}
            style={styles.img}
          />
          <StyledText fontSize="20px" fontWeight={700}>
            Travel Tech Africa
          </StyledText>
        </div>
        <div style={styles.merchantInfo}>
          <div style={styles.avatar}>
            <StyledText fontSize="20px" fontWeight={700}>
              {userData?.username[0]?.toUpperCase()}
            </StyledText>
          </div>
          <div>
            <StyledText fontSize="20px" fontWeight={700}>
              Welcome
            </StyledText>
            <StyledText fontWeight={400}>
              {capitalizeFLetter(userData.username)}
            </StyledText>
          </div>
        </div>
        <div style={{ ...styles.mgL20, ...styles.mgT10, ...styles.mgR20 }}>
          <StyledText fontWeight={400} fontSize="15px">
            On this dashboard, you can:
          </StyledText>
          <StyledText fontWeight={400} fontSize="15px">
            - Create your own trips
          </StyledText>
          <StyledText fontWeight={400} fontSize="15px">
            - Join trips you have been invited to
          </StyledText>
          <StyledText fontWeight={400} fontSize="15px">
            - Vote on your preferred time for the trip
          </StyledText>
          <StyledText fontWeight={400} fontSize="15px">
            - Vote on your preferred accommodation
          </StyledText>
        </div>
        {/* <div style={styles.mgT10}>
          {menus.map((menu, index) => (
            <div
              style={{
                ...styles.menuItem,
                backgroundColor:
                  activeMenu === menu.name
                    ? 'rgba(69, 94, 210, 0.13)'
                    : 'transparent',
              }}
              key={index}
              onClick={() => setActiveMenu(menu.name)}
            >
              <img src={menu.icon} style={styles.mgR20} />
              <StyledText fontWeight={activeMenu === menu.name ? 600 : 400}>
                {menu.title}
              </StyledText>
            </div>
          ))}
        </div> */}
      </div>
      <div style={styles.content}>
        <div>{activeDisplay.component}</div>
      </div>
    </div>
  );
}

const styles = {
  flex: { display: 'flex' },
  flexCenter: { display: 'flex', alignItems: 'center' },
  avatar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
    backgroundColor: 'white',
    marginRight: 20,
  },
  img: {
    width: 60,
    height: 60,
    marginTop: 20,
    marginLeft: 20,
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    width: '20vw',
    // height: '100vh',
    boxShadow: '3px 0px 15px 0px rgba(0, 0, 0, 0.25)',
  },
  merchantInfo: {
    paddingLeft: 20,
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  mgT10: { marginTop: 10 },
  mgR20: { marginRight: 20 },
  mgL20: { marginLeft: 20 },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    height: 65,
    cursor: 'pointer',
    paddingLeft: 20,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '80vw',
    // height: '100vh',
    backgroundColor: '#F6F6F6',
    padding: 40,
    overflowY: 'scroll',
  },
};
