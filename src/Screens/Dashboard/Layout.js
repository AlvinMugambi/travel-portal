import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import StyledText from '../../Components/Common/StyledText';
import Trips from './Trips';
import Settings from './Settings';
import { capitalizeFLetter } from '../../Utils/helpers';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  // const userData = useRecoilValue(UserData);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menus = useMemo(
    () => [
      {
        title: 'Home',
        icon: require('../../Assets/Images/store.png'),
        name: 'dashboard',
        component: <Trips setDrawerOpen={setDrawerOpen} />,
      },
      // {
      //   title: 'Travel Documents',
      //   icon: require('../../Assets/Images/settings.png'),
      //   name: 'settings',
      //   component: <Settings />,
      // },
    ],
    { setDrawerOpen },
  );

  const activeDisplay = useMemo(() => {
    return menus.find((menu) => menu.name === activeMenu);
  }, [activeMenu]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
    }
  }, [userData, navigate]);

  return (
    <div className="flex">
      {isTabletOrMobile && !drawerOpen ? (
        <div></div>
      ) : (
        <div className="drawer">
          <div>
            <div className="flexCenter">
              <img
                src={require('../../Assets/Images/travel-tech-logo.png')}
                alt=""
                className="img"
              />
              <StyledText fontSize="20px" fontWeight={700}>
                Travel Tech Africa
              </StyledText>
              {drawerOpen && (
                <div style={{ paddingLeft: 20 }}>
                  <StyledText
                    color="black"
                    fontSize="30px"
                    onClick={() => setDrawerOpen((prev) => !prev)}
                  >
                    &times;
                  </StyledText>
                </div>
              )}
            </div>
            <div className="merchantInfo">
              <div className="avatar">
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
            <div className="mgT10">
              {menus.map((menu, index) => (
                <div
                  className="menuItem"
                  style={{
                    backgroundColor:
                      activeMenu === menu.name
                        ? 'rgba(69, 94, 210, 0.13)'
                        : 'transparent',
                  }}
                  key={index}
                  onClick={() => setActiveMenu(menu.name)}
                >
                  <img src={menu.icon} className="mgR20" alt="" />
                  <StyledText fontWeight={activeMenu === menu.name ? 600 : 400}>
                    {menu.title}
                  </StyledText>
                </div>
              ))}
            </div>
          </div>
          <div className="mgL20 mgT10 mgR20" style={{ paddingBottom: 30 }}>
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
        </div>
      )}
      <div className="content">
        <div
          style={{ width: '100%', height: '100%', background: 'transaparent' }}
          onClick={() => drawerOpen && setDrawerOpen(false)}
        >
          <div>{activeDisplay.component}</div>
        </div>
      </div>
    </div>
  );
}

// const styles = {
//   flex: { display: 'flex' },
//   flexCenter: { display: 'flex', alignItems: 'center' },
//   avatar: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//     filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
//     backgroundColor: 'white',
//     marginRight: 20,
//   },
//   img: {
//     width: 60,
//     height: 60,
//     marginTop: 20,
//     marginLeft: 20,
//   },
//   drawer: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '20vw',
//     height: '100vh',
//     boxShadow: '3px 0px 15px 0px rgba(0, 0, 0, 0.25)',
//     justifyContent: 'space-between',
//   },
//   merchantInfo: {
//     paddingLeft: 20,
//     display: 'flex',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   mgT10: { marginTop: 10 },
//   mgR20: { marginRight: 20 },
//   mgL20: { marginLeft: 20 },
//   menuItem: {
//     display: 'flex',
//     alignItems: 'center',
//     height: 65,
//     cursor: 'pointer',
//     paddingLeft: 20,
//   },
//   content: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '80vw',
//     // height: '100vh',
//     backgroundColor: '#F6F6F6',
//     padding: 40,
//     overflowY: 'scroll',
//   },
// };
