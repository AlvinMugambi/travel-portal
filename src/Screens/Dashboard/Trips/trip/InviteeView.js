import React, { useEffect, useMemo, useState } from 'react';
import StyledText from '../../../../Components/Common/StyledText';
import Button from '../../../../Components/Common/Button';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { tripService } from '../../../../Services/tripService';
import Input from '../../../../Components/Common/Input';
import { useMediaQuery } from 'react-responsive';
import Modal from '../../../../Components/Common/Modal';
import FormView from '../../../../Components/Common/FormView';

export default function InviteeView({
  selectedTrip,
  inviteStatus,
  setInviteStatus,
  setTripUpdated,
}) {
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [attendees, setAttendees] = useState([]);
  const [prefferedDate, setPrefferedDate] = useState(new Date());
  const [isSuggestingDate, setIsSuggestingDate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const [reason, setReason] = useState('');
  const [accommodationReason, setAccommodationReason] = useState('');
  const [dateMessage, setDateMessage] = useState('');
  const [modalType, setModalType] = useState('activities');
  const [message, setMessage] = useState({ label: '', type: '', for: '' });
  const [hasVoted, setHasVoted] = useState(false);
  const [activities, setActivities] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [voters, setVoters] = useState([]);
  const [modalData, setModalData] = useState();

  useEffect(() => {
    tripService.getTripActivities(selectedTrip?.id, jwtToken).then((res) => {
      setActivities(res.data || []);
    });
    tripService
      .getTripAccommodations(selectedTrip?.id, jwtToken)
      .then((res) => {
        setAccommodations(res.data || []);
      });
  }, [hasVoted, selectedTrip, jwtToken]);

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
  console.log('modalData===>', modalData);
  const denyInvite = () => {
    tripService.denyInvite(selectedTrip.id, jwtToken).then((res) => {
      console.log('denyInvite res===>', res);
      setInviteStatus('denied');
    });
  };

  const inviteeUpdatePreferredDate = () => {
    let startDate;
    let endDate;
    // if (Array.isArray(prefferedDate)) {
    //   startDate = format(new Date(prefferedDate[0]), 'yyyy-MM-dd');
    //   endDate = format(new Date(prefferedDate[1]), 'yyyy-MM-dd');
    // } else {
    startDate = format(new Date(prefferedDate), 'yyyy-MM-dd');
    endDate = format(new Date(prefferedDate), 'yyyy-MM-dd');
    // }

    tripService
      .inviteeUpdatePreferredDate(
        selectedTrip.id,
        startDate,
        endDate,
        reason,
        jwtToken,
      )
      .then((res) => {
        console.log('res===>', res);
        setDateMessage('Your suggestion has been sent to the trip organiser');
        setTimeout(() => {
          setDateMessage('');
        }, 2000);
      });
  };

  const completeInvite = () => {
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

  const voteActivity = (activity) => {
    tripService
      .voteForActivity(selectedTrip?.id, activity?.id, jwtToken)
      .then((res) => {
        if (res.status === 200) {
          setHasVoted((prev) => !prev);
          setMessage({
            label: 'Voted added',
            type: 'success',
            for: 'activities',
          });
          setTimeout(() => {
            setMessage({ label: '', type: '', for: '' });
          }, 2000);
        } else {
          setMessage({
            label:
              res?.error?.response?.data?.error ||
              'Oops. Failed to complete vote. Kindly try again',
            type: 'error',
            for: 'activities',
          });
        }
        setTimeout(() => {
          setMessage({ label: '', type: '', for: '' });
        }, 2000);
        console.log('res====>', res);
      });
  };

  const voteAccommodation = (accommodation) => {
    tripService
      .voteForAccomodation(
        selectedTrip?.id,
        accommodation.id,
        accommodationReason,
        jwtToken,
      )
      .then((res) => {
        setModalVisible(false);
        if (res.status === 200) {
          setHasVoted((prev) => !prev);
          setMessage({
            label: 'Voted added',
            type: 'success',
            for: 'accommodation',
          });
          setTimeout(() => {
            setMessage({ label: '', type: '', for: '' });
          }, 2000);
        } else {
          setMessage({
            label:
              res?.error?.response?.data?.error ||
              'Oops. Failed to complete vote. Kindly try again',
            type: 'error',
            for: 'accommodation',
          });
        }
        setTimeout(() => {
          setMessage({ label: '', type: '', for: '' });
        }, 2000);
        console.log('res====>', res);
      });
  };

  const topVotedAccommodation = useMemo(() => {
    const filteredObjects = accommodations.filter((obj) => obj.votes > 0);
    if (filteredObjects.length === 0) {
      return null;
    }
    const maxVotesObject = filteredObjects.reduce((maxObj, currentObj) => {
      return currentObj.votes > maxObj.votes ? currentObj : maxObj;
    });

    return maxVotesObject;
  }, [accommodations]);

  const topVotedActivity = useMemo(() => {
    const filteredObjects = activities.filter((obj) => obj.votes > 0);
    if (filteredObjects.length === 0) {
      return null;
    }
    const maxVotesObject = filteredObjects.reduce((maxObj, currentObj) => {
      return currentObj.votes > maxObj.votes ? currentObj : maxObj;
    });

    return maxVotesObject;
  }, [activities]);

  const selectedTripAccomodation = useMemo(
    () =>
      accommodations.find(
        (acc) => acc.id == selectedTrip?.selected_accomodation?.[1],
      ),
    [selectedTrip, accommodations],
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
            color="green"
            customStyle={{ marginTop: 15, marginBottom: 15 }}
          >
            Invite accepted
          </StyledText>
          {selectedTrip.date_is_locked ? (
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <StyledText>Date is fixed on:</StyledText>
              <StyledText>
                {format(new Date(selectedTrip?.selected_date), 'PPP')}
              </StyledText>
            </div>
          ) : (
            <>
              <StyledText fontSize="18px" fontWeight={600}>
                Selected date
              </StyledText>
              <div style={{ justifyContent: 'space-between' }}>
                <div style={styles.flexRowCenter}>
                  <img
                    src={require('../../../../Assets/Images/calendar.png')}
                    alt="loc"
                    style={{ width: 15, height: 15, marginRight: 5 }}
                  />
                  <StyledText fontSize="15px">
                    {format(new Date(selectedTrip?.selected_date), 'PPP')}
                  </StyledText>
                </div>
                <div>
                  <Button
                    onClick={() => setIsSuggestingDate(true)}
                    customStyles={{ marginTop: 10 }}
                    label={'Suggest a new date'}
                    width={200}
                    height={40}
                  />
                </div>
              </div>
              {dateMessage && (
                <StyledText color="green" fontSize="14px">
                  {dateMessage}
                </StyledText>
              )}
              {isSuggestingDate && (
                <>
                  <StyledText>Please select your preferred date</StyledText>
                  <Calendar
                    onChange={setPrefferedDate}
                    value={prefferedDate}
                    className={'calendar'}
                  />
                  <Input
                    height={50}
                    width={'100%'}
                    customStyles={{ borderRadius: 10, marginTop: 10 }}
                    placeholder={'State a reason why you prefer this date'}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      onClick={() => {
                        inviteeUpdatePreferredDate();
                        setIsSuggestingDate(false);
                      }}
                      customStyles={{ marginTop: 10 }}
                      label={'Done'}
                      width={100}
                      height={40}
                    />
                  </div>
                </>
              )}
            </>
          )}
          <StyledText fontSize="25px" fontWeight={600}>
            Activities
          </StyledText>
          <StyledText fontSize="18px" fontWeight={600}>
            Top voted activity
          </StyledText>
          <div>
            {topVotedActivity ? (
              <div
                className="flexRowCenter"
                style={{ justifyContent: 'space-between' }}
              >
                <div className="flexRowCenter">
                  <p style={{ marginRight: 20 }}>{topVotedActivity.activity}</p>
                </div>
                <div
                  style={styles.voteBtn}
                  onClick={() => {
                    setModalType('activityVotes');
                    setModalVisible(true);
                    setModalData(topVotedActivity);
                    setVoters(topVotedActivity.voters);
                  }}
                >
                  <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                  {topVotedActivity.votes}
                </div>
              </div>
            ) : (
              <StyledText>No votes yet</StyledText>
            )}
          </div>
          <StyledText
            fontWeight={600}
            customStyle={{ marginTop: 20, marginBottom: 10 }}
          >
            Please select your top two preferred activities
          </StyledText>
          {message.label && message.for === 'activities' && (
            <StyledText
              fontSize="16px"
              fontWeight={600}
              color={message.type === 'error' ? 'red' : 'green'}
              customStyle={{ marginTop: 10, marginBottom: 10 }}
            >
              {message.label}
            </StyledText>
          )}

          {activities.map((activity, index) => (
            <div
              key={index}
              className="flexRowCenter"
              style={{ justifyContent: 'space-between' }}
            >
              <p>{activity.activity}</p>
              <div className="flexRowCenter">
                <div
                  style={{ ...styles.voteBtn, marginRight: 15 }}
                  onClick={() => {
                    setModalType('activities');
                    setModalVisible(true);
                    setModalData(activity);
                    setVoters(activity.voters);
                  }}
                >
                  <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                  {activity.votes || 0}
                </div>
                <div
                  style={{
                    ...styles.voteBtn,
                    backgroundColor: 'blue',
                    color: 'white',
                    paddingRight: 10,
                    paddingLeft: 10,
                  }}
                  onClick={() => {
                    voteActivity(activity);
                  }}
                >
                  Vote
                </div>
              </div>
            </div>
          ))}
          <StyledText fontSize="25px" fontWeight={700}>
            Accomodation
          </StyledText>
          <StyledText fontSize="18px" fontWeight={600}>
            Top voted accommodation
          </StyledText>
          <div>
            {topVotedAccommodation ? (
              <div
                className="flexRowCenter"
                style={{ justifyContent: 'space-between' }}
              >
                <div className="flexRowCenter">
                  <p style={{ marginRight: 20 }}>
                    {topVotedAccommodation.name}
                  </p>
                  <p style={{ color: 'blue' }}>
                    {' '}
                    <a
                      href={topVotedAccommodation?.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {topVotedAccommodation?.link}
                    </a>
                  </p>
                </div>
                <div
                  style={styles.voteBtn}
                  onClick={() => {
                    setModalType('accommodationVotes');
                    setModalVisible(true);
                    setModalData(topVotedAccommodation);
                    setVoters(topVotedAccommodation.voters);
                  }}
                >
                  <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                  {topVotedAccommodation.votes}
                </div>
              </div>
            ) : (
              <StyledText>No votes yet</StyledText>
            )}
          </div>
          {!!accommodations.length && (
            <StyledText
              fontWeight={600}
              customStyle={{ marginTop: 20, marginBottom: 10 }}
            >
              Please select your top two preferred accommodation
            </StyledText>
          )}
          {message.label && message.for === 'accommodation' && (
            <StyledText
              fontSize="16px"
              fontWeight={600}
              color={message.type === 'error' ? 'red' : 'green'}
              customStyle={{ marginTop: 10, marginBottom: 10 }}
            >
              {message.label}
            </StyledText>
          )}
          <div>
            {accommodations.length ? (
              accommodations.map((accommodation, index) => (
                <div
                  key={index}
                  className="flexRowCenter"
                  style={{ justifyContent: 'space-between' }}
                >
                  <div className="flexRowCenter">
                    <p style={{ marginRight: 20 }}>{accommodation.name}</p>
                    <p style={{ color: 'blue' }}>
                      <a
                        href={accommodation?.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {accommodation?.link}
                      </a>
                    </p>
                  </div>
                  <div className="flexRowCenter">
                    <div
                      style={{ ...styles.voteBtn, marginRight: 15 }}
                      onClick={() => {
                        setModalType('accommodationVotes');
                        setModalVisible(true);
                        setModalData(accommodation);
                        setVoters(accommodation.voters);
                      }}
                    >
                      <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                      {accommodation.votes || 0}
                    </div>
                    <div
                      style={{
                        ...styles.voteBtn,
                        backgroundColor: 'blue',
                        color: 'white',
                        paddingRight: 10,
                        paddingLeft: 10,
                      }}
                      onClick={() => {
                        setModalVisible(true);
                        setModalType('accommodationVote');
                        setModalData(accommodation);
                      }}
                    >
                      Vote
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <StyledText>No Accommodations added yet</StyledText>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: 20,
            }}
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
      <Modal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        width={isTabletOrMobile ? '90%' : 600}
        maxHeight={'95vh'}
      >
        <div style={{ padding: '10px 20px' }}>
          <div className="tripModalHeader">
            <StyledText fontSize="25px" fontWeight={700}>
              {modalType === 'activities'
                ? `Votes for ${modalData?.activity}`
                : modalType === 'accommodationVote'
                ? 'Reason'
                : `Votes for ${modalData?.name}`}
            </StyledText>
            <div>
              <StyledText
                color="black"
                fontSize="30px"
                onClick={() => setModalVisible((prev) => !prev)}
              >
                &times;
              </StyledText>
            </div>
          </div>
          <div className="form">
            <FormView width={'100%'}>
              {modalType === 'activities' && (
                <>
                  <StyledText fontWeight={500}>
                    Number of votes: {voters.length}
                  </StyledText>
                  <div className="flexRowCenter">
                    {voters.map((voter) => (
                      <div style={styles.voterBox}>
                        <div
                          style={{
                            ...styles.attendee,
                            marginRight: 0,
                            padding: 2,
                          }}
                        >
                          <div
                            style={{ ...styles.avatar, width: 40, height: 40 }}
                          >
                            {voter?.voter?.username?.[0]?.toUpperCase()}
                          </div>
                          <StyledText fontSize="14px">
                            {voter?.voter?.username}
                          </StyledText>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {modalType === 'accommodationVotes' && (
                <>
                  <StyledText fontWeight={500}>
                    Number of votes: {voters.length}
                  </StyledText>
                  <div
                    className="flexRowCenter"
                    style={{ justifyContent: 'center' }}
                  >
                    {voters.map((voter) => (
                      <div style={styles.voterBox}>
                        <div
                          style={{
                            ...styles.attendee,
                            borderRight: '1px solid grey',
                            paddingRight: 15,
                          }}
                        >
                          <div
                            style={{ ...styles.avatar, width: 40, height: 40 }}
                          >
                            {voter?.voter?.username?.[0]?.toUpperCase()}
                          </div>
                          <StyledText fontSize="14px">
                            {voter?.voter?.username}
                          </StyledText>
                        </div>
                        <div
                          style={{
                            minWidth: 100,
                            maxWidth: 200,
                            height: '100%',
                          }}
                        >
                          <StyledText fontSize="14px">
                            {voter?.reason}
                          </StyledText>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedTripAccomodation?.id === modalData?.id && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={require('../../../../Assets/Icons/checked.png')}
                        alt=""
                        style={styles.confirmCheck}
                      />
                      <StyledText customStyle={{ textAlign: 'center' }}>
                        Selected as preferred accomodation
                      </StyledText>
                    </div>
                  )}
                </>
              )}
              {modalType === 'activityVotes' && (
                <>
                  <StyledText fontWeight={500}>
                    Number of votes: {voters.length}
                  </StyledText>
                  <div className="flexRowCenter">
                    {voters.map((voter) => (
                      <div style={styles.voterBox}>
                        <div
                          style={{
                            ...styles.attendee,
                            marginRight: 0,
                            padding: 2,
                          }}
                        >
                          <div
                            style={{ ...styles.avatar, width: 40, height: 40 }}
                          >
                            {voter?.voter?.username?.[0]?.toUpperCase()}
                          </div>
                          <StyledText fontSize="14px">
                            {voter?.voter?.username}
                          </StyledText>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {modalType === 'accommodationVote' && (
                <div>
                  <div style={styles.input}>
                    <StyledText fontSize={16}>
                      State a reason why you preffer this accommodation to let
                      other invitees know
                    </StyledText>
                    <Input
                      width={'100%'}
                      placeholder={'e.g. It is at the beach!'}
                      onChange={(e) => setAccommodationReason(e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: 30 }}>
                    <Button
                      label={'Submit'}
                      width={isTabletOrMobile ? '100%' : 420}
                      onClick={() => {
                        voteAccommodation(modalData);
                      }}
                    />
                  </div>
                </div>
              )}
            </FormView>
          </div>
        </div>
      </Modal>
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
  voteBtn: {
    backgroundColor: '#55c2da',
    padding: 5,
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: 15,
  },
  confirmCheck: {
    width: 40,
  },
  voterBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    border: '1px solid grey',
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: 'white',
    maxWidth: 300,
    minHeight: 100,
    wordWrap: 'break-word',
    marginBottom: 20,
  },
};
