import React, { useEffect, useMemo, useState } from 'react';
import StyledText from '../../../../Components/Common/StyledText';
import Button from '../../../../Components/Common/Button';
import Calendar from 'react-calendar';
import { accommodations } from '../../../../static';
import { format } from 'date-fns';
import { tripService } from '../../../../Services/tripService';

export default function InviteeView({
  selectedTrip,
  inviteStatus,
  setInviteStatus,
  setPreviewAccommodation,
  setModalVisible,
  getAccomodationVotes,
  setTripUpdated,
}) {
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [attendees, setAttendees] = useState([]);
  const [prefferedDate, setPrefferedDate] = useState(new Date());

  useEffect(() => {
    tripService.getTripAttendees(selectedTrip.id, jwtToken).then((res) => {
      setAttendees(res.data || []);
    });
  }, [inviteStatus, jwtToken, selectedTrip.id]);

  const acceptInvite = () => {
    tripService.acceptInvite(selectedTrip.id, jwtToken).then((res) => {
      console.log('acceptInvite res===>', res);
      setInviteStatus('accepted');
    });
  };
  const denyInvite = () => {
    tripService.denyInvite(selectedTrip.id, jwtToken).then((res) => {
      console.log('denyInvite res===>', res);
      setInviteStatus('denied');
    });
  };

  const inviteeUpdatePreferredDate = () => {
    let startDate;
    let endDate;
    if (Array.isArray(prefferedDate)) {
      startDate = format(new Date(prefferedDate[0]), 'yyyy-MM-dd');
      endDate = format(new Date(prefferedDate[1]), 'yyyy-MM-dd');
    } else {
      startDate = format(new Date(prefferedDate), 'yyyy-MM-dd');
      endDate = format(new Date(prefferedDate), 'yyyy-MM-dd');
    }

    tripService
      .inviteeUpdatePreferredDate(selectedTrip.id, startDate, endDate, jwtToken)
      .then((res) => {
        console.log('res===>', res);
      });
  };

  const completeInvite = () => {
    inviteeUpdatePreferredDate();
    tripService.completeInvite(selectedTrip.id, jwtToken).then((res) => {
      console.log('completeInvite res===>', res);
      setInviteStatus('done');
      setTripUpdated((prev) => !prev);
    });
  };

  const confirmedAttendees = useMemo(
    () => attendees.filter((a) => a.invite_accepted),
    [attendees],
  );
  return (
    <>
      <div>
        <StyledText fontSize="18px" fontWeight={600}>
          Confirmed attendees
        </StyledText>
        <div style={{ ...styles.flexRowCenter, flexWrap: 'wrap' }}>
          {confirmedAttendees.length ? (
            confirmedAttendees.map((attendee) => (
              <div style={styles.attendee}>
                <div style={{ ...styles.avatar, width: 50, height: 50 }}>
                  {attendee?.attendee?.username[0]?.toUpperCase()}
                </div>
                <StyledText>
                  {attendee?.attendee?.username === userData?.username
                    ? 'You'
                    : attendee?.attendee?.username}
                </StyledText>
              </div>
            ))
          ) : (
            <StyledText>No confirmed attendees yet</StyledText>
          )}
        </div>
      </div>
      {inviteStatus === 'pending' && (
        <div>
          <StyledText fontSize="18px" fontWeight={600}>
            Accept/Deny invite
          </StyledText>
          <StyledText>
            You can choose to accept or deny this invite. When accepting, you
            will fill be allowed to vote for your preferred dates and the
            accommodation with regards to where you are going to stay
          </StyledText>
          <div style={styles.btn}>
            <Button
              label={'Accept'}
              width={100}
              height={30}
              onClick={() => {
                acceptInvite();
              }}
            />
            <Button
              label={'Deny'}
              width={100}
              height={30}
              backgroundColor="red"
              onClick={() => {
                denyInvite();
              }}
            />
          </div>
        </div>
      )}
      {inviteStatus === 'accepted' && (
        <div>
          <StyledText
            fontSize="18px"
            fontWeight={600}
            customStyle={{ marginTop: 15, marginBottom: 15 }}
          >
            Invite accepted
          </StyledText>
          {selectedTrip.date_is_locked ? (
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <StyledText>Date is fixed on:</StyledText>
              <StyledText>
                {format(new Date(selectedTrip.end_date), 'PPP')}
              </StyledText>
            </div>
          ) : (
            <>
              <StyledText>Please select your preferred date</StyledText>
              <Calendar
                minDate={new Date(selectedTrip.start_date)}
                maxDate={new Date(selectedTrip.end_date)}
                onChange={setPrefferedDate}
                value={prefferedDate}
                selectRange
              />
            </>
          )}
          <StyledText customStyle={{ marginTop: 20, marginBottom: 10 }}>
            Please select your preferred accommodation
          </StyledText>
          <StyledText fontSize="13px">
            Based on the number of attendees, and the selected date, here are
            the top recommendations for accommodation in{' '}
            {selectedTrip.destination}
          </StyledText>
          <div style={styles.acommodationView}>
            {accommodations.map((accommodation) => (
              <div
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
          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}
          >
            <Button
              label={'Done'}
              width={400}
              onClick={() => {
                completeInvite();
              }}
            />
          </div>
        </div>
      )}
      {inviteStatus === 'denied' && (
        <div>
          <StyledText
            fontSize="18px"
            fontWeight={600}
            customStyle={{ marginTop: 15, marginBottom: 15 }}
          >
            Invitation denied
          </StyledText>
        </div>
      )}
      {inviteStatus === 'done' && (
        <div>
          <StyledText
            fontSize="18px"
            fontWeight={600}
            customStyle={{ marginTop: 15, marginBottom: 15 }}
          >
            Great! Your votes have been sent to the organiser of the trip.
          </StyledText>
        </div>
      )}
    </>
  );
}

const styles = {
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    marginTop: 30,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    width: 250,
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
    width: 50,
    marginRight: 10,
  },
};
