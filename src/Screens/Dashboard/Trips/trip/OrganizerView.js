import React, { useEffect, useMemo, useState } from 'react';
import StyledText from '../../../../Components/Common/StyledText';
import { accommodations } from '../../../../static';
import Button from '../../../../Components/Common/Button';
import { tripService } from '../../../../Services/tripService';
import { authService } from '../../../../Services/authService';

export default function OrganizerView({
  tripId,
  setPreviewAccommodation,
  setModalVisible,
  getAccomodationVotes,
  accomodationVotes,
  topSeletedDate,
}) {
  // const jwtToken = useRecoilValue(JwtTokenState);
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [attendees, setAttendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    tripService.getTripAttendees(tripId, jwtToken).then((res) => {
      setAttendees(res.data || []);
    });
  }, [inviteSent, jwtToken, tripId]);

  useEffect(() => {
    authService.getUsers().then((res) => {
      setUsers(res.data || []);
    });
  }, []);

  const topVotedAccommodation = useMemo(() => {
    const id = accomodationVotes.length
      ? accomodationVotes.reduce((max, obj) =>
          max['dcount'] > obj['dcount'] ? max : obj,
        ).selected_accomodation_id
      : 0;
    return accommodations.find((acc) => acc.id === id);
  }, [accomodationVotes]);

  const uninvitedUsers = useMemo(
    () =>
      users.filter(function (objFromA) {
        return !attendees.find(function (objFromB) {
          return (
            objFromA.username === objFromB.attendee.username ||
            objFromA.username === userData.username
          );
        });
      }),
    [users, attendees, userData.username],
  );

  const invite = (username) => {
    tripService.sendTripInvite(username, tripId, jwtToken).then((res) => {
      if (res.status === 200) {
        setInviteSent(true);
        setTimeout(() => {
          setInviteSent(false);
        }, 2000);
      }
    });
  };

  return (
    <div>
      <div>
        <StyledText fontSize="18px" fontWeight={600}>
          Trip invites
        </StyledText>
        <div style={{ ...styles.flexRowCenter, flexWrap: 'wrap' }}>
          {attendees.length ? (
            attendees.map((attendee) => (
              <div style={styles.attendee}>
                <div style={{ ...styles.avatar, width: 50, height: 50 }}>
                  {attendee?.attendee?.username[0]?.toUpperCase()}
                  {attendee.invite_accepted && (
                    <img
                      src={require('../../../../Assets/Icons/checked.png')}
                      alt=''
                      style={styles.check}
                    />
                  )}
                </div>
                <StyledText>{attendee?.attendee?.username}</StyledText>
              </div>
            ))
          ) : (
            <StyledText>No invites sent out yet</StyledText>
          )}
        </div>
        {!!uninvitedUsers.length && (
          <div>
            <StyledText fontWeight={600}>
              Click a user to send an invite
            </StyledText>
            {inviteSent && <StyledText color="green">Invite sent!</StyledText>}
            <div style={{ ...styles.flexRowCenter, flexWrap: 'wrap' }}>
              {uninvitedUsers.map((user) => (
                <div
                  style={styles.attendee}
                  onClick={() => invite(user.username)}
                >
                  <div style={{ ...styles.avatar, width: 50, height: 50 }}>
                    {user?.username[0]?.toUpperCase()}
                  </div>
                  <StyledText>{user?.username}</StyledText>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ margin: '20px 0' }}>
        <StyledText fontSize="18px" fontWeight={600}>
          Top selected date
        </StyledText>
        {/* {topSeletedDate?.length ?  */}
        <div style={styles.flexRowCenter}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 20,
              alignItems: 'center',
            }}
          >
            <div style={styles.flexRowCenter}>
              <img
                src={require('../../../../Assets/Images/calendar.png')}
                alt="loc"
                style={{ width: 15, height: 15, marginRight: 5 }}
              />
              <StyledText fontSize="15px">
                30th Oct 2023 - 12th Nov 2023
              </StyledText>
            </div>
            <Button label={'Set as trip date'} width={200} height={40} />
          </div>
        </div>
        {/* //  :
        //  (
        //   <div style={{marginTop: 20, marginBottom: 20}}>
        //     <StyledText>No date votes yet</StyledText>
        //   </div>
        // )} */}
        <StyledText fontSize="18px" fontWeight={600}>
          Top voted accommodation
        </StyledText>
        <div style={{ margin: '20px 0' }}>
          {topVotedAccommodation ? (
            <div
              className="ripple-btn"
              style={{ ...styles.accommodationCardView, width: 'fit-content' }}
              onClick={() => {
                setPreviewAccommodation(topVotedAccommodation);
                setModalVisible(true);
              }}
            >
              <div style={styles.accommodationBox}>
                <img
                  src={topVotedAccommodation?.image?.[0]}
                  alt=''
                  style={styles.accommodationImg}
                />
                <div
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    ...styles.flexRowCenter,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <StyledText fontWeight={600}>
                      {topVotedAccommodation?.name}
                    </StyledText>
                    <StyledText fontSize="14px">
                      Votes: {getAccomodationVotes(topVotedAccommodation?.id)}
                    </StyledText>
                  </div>
                  <div>
                    <div
                      style={{
                        ...styles.flexRowCenter,
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={require('../../../../Assets/Icons/rating.png')}
                        alt=''
                        style={{ width: 20, marginRight: 5 }}
                      />
                      <StyledText fontSize="14px">
                        {topVotedAccommodation?.rating}
                      </StyledText>
                    </div>
                    <StyledText fontWeight={500} fontSize="14px">
                      Ksh {topVotedAccommodation?.price}
                    </StyledText>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <StyledText>No votes yet</StyledText>
          )}
        </div>
      </div>
      <StyledText fontSize="18px" fontWeight={600}>
        Available accommodations
      </StyledText>
      <div style={styles.acommodationView}>
        {accommodations.map((accommodation, index) => (
          <div
            key={index}
            className="ripple-btn"
            style={styles.accommodationCardView}
            onClick={() => {
              setPreviewAccommodation(accommodation);
              setModalVisible(true);
            }}
          >
            <div style={styles.accommodationBox}>
              <img
                src={accommodation?.image?.[0]}
                alt=''
                style={styles.accommodationImg}
              />
              <div
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  ...styles.flexRowCenter,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <StyledText fontWeight={600}>
                    {accommodation?.name}
                  </StyledText>
                  <StyledText fontSize="14px">
                    Votes: {getAccomodationVotes(accommodation?.id)}
                  </StyledText>
                </div>
                <div>
                  <div
                    style={{
                      ...styles.flexRowCenter,
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={require('../../../../Assets/Icons/rating.png')}
                      alt=''
                      style={{ width: 20, marginRight: 5 }}
                    />
                    <StyledText fontSize="14px">
                      {accommodation?.rating}
                    </StyledText>
                  </div>
                  <StyledText fontWeight={500} fontSize="14px">
                    Ksh {accommodation?.price}
                  </StyledText>
                </div>
              </div>
            </div>
          </div>
        ))}
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
  acommodationView: {
    display: 'flex',
    overflowX: 'scroll',
    width: '100%',
    flexWrap: 'nowrap',
    paddingBottom: 10,
    paddingTop: 10,
  },
  accommodationBox: {
    width: 270,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  accommodationCardView: {
    flex: '0 0 auto',
    marginRight: 20,
    cursor: 'pointer',
  },
  accommodationImg: {
    width: '100%',
    height: '50%',
    imageResolution: 'from-image',
    borderRadius: '10px 10px 0 0',
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
  },
  attendee: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // width: 50,
    marginRight: 20,
    cursor: 'pointer',
  },
  check: { position: 'absolute', left: 20, top: 35, width: 20 },
};
