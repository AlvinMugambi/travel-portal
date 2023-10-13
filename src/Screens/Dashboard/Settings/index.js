import React from 'react';
import { ReactComponent as NotificationIcon } from '../../../Assets/Icons/notification.svg';
import StyledText from '../../../Components/Common/StyledText';

export default function Settings() {
  return (
    <div>
      <div style={styles.header}>
        <div style={styles.flexRowCenter}>
          <StyledText fontSize="30px" fontWeight={700}>
            Settings
          </StyledText>
        </div>
        <div style={styles.headerRight}>
          <NotificationIcon style={styles.notification} />
          <div style={styles.avatar}>
            <StyledText fontSize="20px" fontWeight={700}>
              J
            </StyledText>
          </div>
          <p>John Doe</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notification: {
    marginRight: 30,
    width: 30,
  },
  avatar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
    backgroundColor: 'white',
    marginRight: 10,
  },
};
