import React, { useMemo, useState } from 'react';
import StyledText from '../../../../Components/Common/StyledText';
import Button from '../../../../Components/Common/Button';
import { tripService } from '../../../../Services/tripService';
import Input from '../../../../Components/Common/Input';
import { Calendar } from 'react-multi-date-picker';
import { formatDate } from '../../../../Utils/helpers';
import { CirclesWithBar } from 'react-loader-spinner';

export default function InviteeView({
  selectedTrip,
  inviteStatus,
  setInviteStatus,
  setTripUpdated,
  setPreviewAccommodation,
  setPreviewModalVisible,
  accommodationsLoading,
  attendees,
  accommodations,
  activities,
  topVotedActivity,
  topVotedAccommodation,
  accommodationData,
  setVoters,
  setModalType,
  message,
  voteActivity,
  setModalVisible,
  setModalData,
  modalData,
  nonUser,
  setVoterName,
  voterName,
}) {
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [prefferedDate, setPrefferedDate] = useState([new Date()]);
  const [isSuggestingDate, setIsSuggestingDate] = useState(false);
  const [reason, setReason] = useState('');
  const [dateMessage, setDateMessage] = useState('');

  const acceptInvite = () => {
    tripService.acceptInvite(selectedTrip?.id, jwtToken).then((res) => {
      console.log('acceptInvite res===>', res);
      setInviteStatus('accepted');
    });
  };

  const denyInvite = () => {
    tripService.denyInvite(selectedTrip?.id, jwtToken).then((res) => {
      console.log('denyInvite res===>', res);
      setInviteStatus('denied');
    });
  };

  const inviteeUpdatePreferredDate = () => {
    console.log('prefferedDate===>', prefferedDate);
    prefferedDate.forEach((dateArray) => {
      let startDate;
      let endDate;

      if (dateArray.length === 1) {
        startDate = new Date(dateArray[0]);
        endDate = new Date(dateArray[0]);
      } else {
        startDate = new Date(dateArray[0]);
        endDate = new Date(dateArray[1]);
      }

      tripService
        .inviteeUpdatePreferredDate(
          selectedTrip?.id,
          startDate,
          endDate,
          reason,
          jwtToken,
          voterName,
        )
        .then((res) => {
          console.log('res===>', res);
          setDateMessage('Your suggestion has been sent to the trip organiser');
          setTimeout(() => {
            setDateMessage('');
          }, 2000);
        });
    });
  };

  const completeInvite = () => {
    tripService.completeInvite(selectedTrip?.id, jwtToken).then((res) => {
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
                  {attendee?.attendee?.firstname[0]?.toUpperCase()}
                </div>
                <StyledText>
                  {attendee?.attendee?.email === userData?.email
                    ? 'You'
                    : attendee?.attendee?.firstname}
                </StyledText>
              </div>
            ))
          ) : (
            <StyledText>No confirmed attendees yet</StyledText>
          )}
        </div>
      </div>
      <div style={styles.divider} />
      {inviteStatus === 'pending' && (
        <div>
          {nonUser && (
            <div style={{ marginBottom: 30 }}>
              <StyledText fontSize={16}>
                Enter your name to accept the invite
              </StyledText>
              <Input
                width={'100%'}
                placeholder={'What is your name?'}
                backgroundColor="#F6F6F6"
                onChange={(e) => setVoterName(e.target.value)}
              />
            </div>
          )}
          <StyledText fontSize="18px" fontWeight={600}>
            Accept/Deny invite
          </StyledText>
          <StyledText>
            You can choose to accept or deny this invite. When accepting, you
            will be able to vote for your preferred dates and the accommodation
            with regards to your availability and preference
          </StyledText>
          <div style={styles.btn}>
            <Button
              label={'Accept'}
              width={100}
              height={30}
              disabled={!voterName}
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
          <div style={styles.divider} />
          <StyledText fontSize="20px" fontWeight={700}>
            Trip Date
          </StyledText>
          {selectedTrip?.date_is_locked ? (
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <StyledText>Date is fixed on:</StyledText>
              <StyledText>
                {selectedTrip?.start_date} - {selectedTrip?.end_date}
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
                    {formatDate(selectedTrip?.start_date)} -{' '}
                    {formatDate(selectedTrip?.end_date)}
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
                    onChange={(e) => {
                      console.log('e===>', e);
                      setPrefferedDate(e);
                    }}
                    // value={prefferedDate}
                    className={'calendar'}
                    // selectRange
                    multiple
                    range
                    minDate={new Date(selectedTrip?.start_date)}
                    maxDate={new Date(selectedTrip?.end_date)}
                  />
                  <Input
                    height={50}
                    width={'100%'}
                    customStyles={{ borderRadius: 10, marginTop: 10 }}
                    backgroundColor={'#F6F6F6'}
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
          {!!activities.length && (
            <>
              <div style={styles.divider} />
              <StyledText
                fontSize="25px"
                fontWeight={600}
                customStyle={{ marginTop: 20 }}
              >
                Activities
              </StyledText>
              <StyledText fontSize="18px" fontWeight={600}>
                Top voted activity
              </StyledText>
              <div style={{ marginBottom: 20 }}>
                {topVotedActivity ? (
                  <div
                    className="flexRowCenter"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div className="flexRowCenter">
                      <p style={{ marginRight: 20 }}>
                        {topVotedActivity.activity}
                      </p>
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
                      <span style={{ fontWeight: '600' }}>Votes:</span>
                      <span style={{ paddingLeft: 5 }}>
                        {topVotedActivity.votes}
                      </span>
                    </div>
                  </div>
                ) : (
                  <StyledText>No votes yet</StyledText>
                )}
              </div>
              {!!activities.length && (
                <StyledText
                  fontWeight={600}
                  customStyle={{ marginTop: 20, marginBottom: 10 }}
                >
                  Please select your top two preferred activities
                </StyledText>
              )}
              {message?.label && (
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
                  <div className="flexRowCenter" style={{ marginBottom: 10 }}>
                    <div
                      style={{ ...styles.voteBtn, marginRight: 15 }}
                      onClick={() => {
                        setModalType('activityVotes');
                        setModalVisible(true);
                        setModalData(activity);
                        setVoters(activity.voters);
                      }}
                    >
                      <span style={{ fontWeight: '600' }}>Votes:</span>
                      <span style={{ paddingLeft: 5 }}>
                        {activity.votes || 0}
                      </span>
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
            </>
          )}
          <div style={styles.divider} />
          <StyledText fontSize="25px" fontWeight={700}>
            Accommodation
          </StyledText>
          <StyledText fontSize="18px" fontWeight={600}>
            Top voted accommodation
          </StyledText>
          <div>
            {topVotedAccommodation ? (
              <div style={styles.accommodationCardView}>
                <div className="ripple-btn" style={styles.accommodationBox}>
                  <div
                    style={styles.accommodationImg}
                    onClick={() => {
                      const data = accommodationData(
                        topVotedAccommodation.name,
                      );
                      if (data) {
                        data.voters = topVotedAccommodation.voters;
                        setPreviewAccommodation(data);
                        setPreviewModalVisible(true);
                      } else {
                        window.open(
                          topVotedAccommodation?.link,
                          '_blank',
                          'rel=noopener noreferrer',
                        );
                      }
                    }}
                  >
                    <img
                      src={
                        topVotedAccommodation?.image ||
                        require('../../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=""
                      style={{ ...styles.accommodationImg, height: '90%' }}
                    />
                  </div>
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
                      {topVotedAccommodation?.address?.street && (
                        <div
                          className="flexRowCenter"
                          style={{ width: 50, flexShrink: 1 }}
                        >
                          <img
                            src={require('../../../../Assets/Images/location.png')}
                            alt="loc"
                            style={{ width: 15, height: 15, marginRight: 5 }}
                          />
                          {/* <StyledText>
                            {topVotedAccommodation?.address?.street}
                          </StyledText> */}
                        </div>
                      )}
                    </div>
                    <div>
                      {topVotedAccommodation?.rating ? (
                        <div
                          style={{
                            ...styles.flexRowCenter,
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={require('../../../../Assets/Icons/rating.png')}
                            alt=""
                            style={{ width: 20, marginRight: 5 }}
                          />
                          <StyledText fontSize="14px">
                            {topVotedAccommodation?.rating}
                          </StyledText>
                        </div>
                      ) : (
                        <div style={{ height: 0 }} />
                      )}
                      {topVotedAccommodation?.price && (
                        <StyledText fontWeight={500} fontSize="14px">
                          Ksh {topVotedAccommodation?.price}
                        </StyledText>
                      )}
                      <div className="flexRowCenter">
                        <div
                          style={{ ...styles.voteBtn, marginRight: 15 }}
                          onClick={() => {
                            setModalType('accommodationVotes');
                            setModalVisible(true);
                            setModalData(topVotedAccommodation);
                            setVoters(topVotedAccommodation.voters);
                          }}
                        >
                          <span style={{ fontWeight: '600' }}>Votes:</span>
                          <span style={{ paddingLeft: 5 }}>
                            {topVotedAccommodation.votes || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <StyledText>No votes yet</StyledText>
              </div>
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
          {message?.label && message.for === 'accommodation' && (
            <StyledText
              fontSize="16px"
              fontWeight={600}
              color={message.type === 'error' ? 'red' : 'green'}
              customStyle={{ marginTop: 10, marginBottom: 10 }}
            >
              {message.label}
            </StyledText>
          )}
          <div style={styles.acommodationView}>
            {accommodationsLoading ? (
              <div className="flexRowCenter">
                <CirclesWithBar
                  height="100"
                  width="100"
                  color="#4fa94d"
                  wrapperClass=""
                  visible={true}
                  outerCircleColor=""
                  innerCircleColor=""
                  barColor=""
                  ariaLabel="circles-with-bar-loading"
                />
                <StyledText customStyle={{ paddingLeft: 20 }}>
                  Hang tight as we get more info on the accommodation...
                </StyledText>
              </div>
            ) : (
              !!accommodations.length &&
              accommodations.map((accommodation, index) => {
                const data = accommodationData(accommodation.name);
                return (
                  <div
                    className="ripple-btn"
                    style={styles.accommodationCardView}
                  >
                    <div style={styles.accommodationBox}>
                      <div
                        style={styles.accommodationImg}
                        onClick={() => {
                          if (data) {
                            data.voters = accommodation.voters;
                            setPreviewAccommodation(data);
                            setPreviewModalVisible(true);
                          } else {
                            window.open(
                              accommodation?.link,
                              '_blank',
                              'rel=noopener noreferrer',
                            );
                          }
                        }}
                      >
                        <img
                          src={
                            data?.image ||
                            require('../../../../Assets/Images/Diani_Beach.jpg')
                          }
                          alt=""
                          style={{ ...styles.accommodationImg, height: '90%' }}
                        />
                      </div>
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
                          {data?.address?.street && (
                            <div className="flexRowCenter">
                              <img
                                src={require('../../../../Assets/Images/location.png')}
                                alt="loc"
                                style={{
                                  width: 15,
                                  height: 15,
                                  marginRight: 5,
                                }}
                              />
                              <StyledText>{data?.address?.street}</StyledText>
                            </div>
                          )}
                        </div>
                        <div>
                          {data?.rating ? (
                            <div
                              style={{
                                ...styles.flexRowCenter,
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src={require('../../../../Assets/Icons/rating.png')}
                                alt=""
                                style={{ width: 20, marginRight: 5 }}
                              />
                              <StyledText fontSize="14px">
                                {data?.rating}
                              </StyledText>
                            </div>
                          ) : (
                            <div />
                          )}
                          {data?.price && (
                            <StyledText fontWeight={500} fontSize="14px">
                              Ksh {data?.price}
                            </StyledText>
                          )}
                          <div>
                            <div
                              style={{
                                ...styles.voteBtn,
                                marginRight: 15,
                                marginBottom: 10,
                              }}
                              onClick={() => {
                                setModalType('accommodationVotes');
                                setModalVisible(true);
                                setModalData(accommodation);
                                setVoters(accommodation.voters);
                              }}
                            >
                              <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                              <span style={{ paddingLeft: 5 }}>
                                {accommodation.votes || 0}
                              </span>
                            </div>
                            <div
                              style={{
                                ...styles.voteBtn,
                                backgroundColor: 'blue',
                                color: 'white',
                                paddingRight: 10,
                                paddingLeft: 10,
                                width: '70px',
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
                      </div>
                    </div>
                  </div>
                );
              })
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
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: '0px 3px 8px 0px rgba(0,0,0,0.7)',
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
    marginRight: 10,
  },
  voteBtn: {
    backgroundColor: '#F57878',
    padding: 5,
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
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
  divider: {
    height: 5,
    backgroundColor: '#F6F6F6',
    marginTop: 10,
    marginBottom: 10,
  },
};
