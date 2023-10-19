import React, { useCallback, useEffect, useMemo, useState } from 'react';

import StyledText from '../../../../Components/Common/StyledText';
import Button from '../../../../Components/Common/Button';
import { tripService } from '../../../../Services/tripService';
import { authService } from '../../../../Services/authService';
import Calendar from 'react-calendar';
import { format, isEqual } from 'date-fns';
import Input from '../../../../Components/Common/Input';
import { useMediaQuery } from 'react-responsive';
import Modal from '../../../../Components/Common/Modal';
import FormView from '../../../../Components/Common/FormView';

export default function OrganizerView({ selectedTrip }) {
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [attendees, setAttendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [inviteSent, setInviteSent] = useState(false);
  const [isEdittingDate, setIsEdittingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [proposedDates, setProposedDates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [accommodationName, setAccommodationName] = useState('');
  const [accommodationLink, setAccommodationLink] = useState('');
  const [activity, setActivity] = useState('');
  const [userSearchPhrase, setUserSearchPhrase] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState();
  const [modalAccommodationData, setModalAccommodationData] = useState();
  const [modalType, setModalType] = useState('accomodation');
  const [modalVisible, setModalVisible] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const [tripUpdated, setTripUpdated] = useState(false);
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    tripService.getTripAttendees(selectedTrip?.id, jwtToken).then((res) => {
      setAttendees(res.data || []);
    });
    tripService.getTripProposedDates(selectedTrip?.id, jwtToken).then((res) => {
      setProposedDates(res.data || []);
    });
  }, [inviteSent, jwtToken, selectedTrip]);

  useEffect(() => {
    tripService.getTripActivities(selectedTrip?.id, jwtToken).then((res) => {
      setActivities(res.data || []);
    });
    tripService
      .getTripAccommodations(selectedTrip?.id, jwtToken)
      .then((res) => {
        setAccommodations(res.data || []);
      });
  }, [tripUpdated, selectedTrip, jwtToken]);

  useEffect(() => {
    authService.getUsers().then((res) => {
      setUsers(res.data || []);
    });
  }, []);

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

  const uninvitedUsers = useMemo(
    () =>
      users.filter(function (objFromA) {
        return !attendees.find(function (objFromB) {
          return (
            objFromA.email === objFromB.attendee.email ||
            objFromA.email === userData.email
          );
        });
      }),
    [users, attendees, userData.email],
  );

  const filteredUninvitedUsers = useMemo(() => {
    if (!userSearchPhrase) {
      return [];
    } else {
      return uninvitedUsers.filter((item) =>
        item.firstname
          .toUpperCase()
          .replaceAll(' ', '')
          .includes(
            userSearchPhrase
              .toUpperCase()
              .trim()
              .replaceAll(' ', '')
              .replace(/\s/g, ''),
          ) ||
          item.surname
          .toUpperCase()
          .replaceAll(' ', '')
          .includes(
            userSearchPhrase
              .toUpperCase()
              .trim()
              .replaceAll(' ', '')
              .replace(/\s/g, ''),
          )
      );
    }
  }, [userSearchPhrase, uninvitedUsers]);

  const invite = (username) => {
    tripService
      .sendTripInvite(username, selectedTrip?.id, jwtToken)
      .then((res) => {
        if (res.status === 200) {
          setInviteSent(true);
          setTimeout(() => {
            setInviteSent(false);
          }, 2000);
        }
      });
  };

  const updateTripDate = (selected_available_startdate) => {
    console.log('selectedDate==>', selectedDate);
    const date = new Date(selected_available_startdate) 

    tripService.updateTripDate(selectedTrip.id, date, jwtToken).then((res) => {
      if (res.status === 200) {
        console.log('res==>', res);
        console.log(
          'selected_available_startdate==>',
          date,
        );
        setSelectedDate(date);
      }
    });
  };

  const addAccommodation = () => {
    tripService
      .addTripAccommodation(
        selectedTrip?.id,
        accommodationName,
        accommodationLink,
        jwtToken,
      )
      .then((res) => {
        console.log('res====>', res);
        setTripUpdated(!tripUpdated);
      });
  };

  const addActivity = () => {
    tripService
      .addTripActivity(selectedTrip?.id, activity, jwtToken)
      .then((res) => {
        console.log('res====>', res);
        setTripUpdated(!tripUpdated);
      });
  };

  const organiserSelectAccomodation = () => {
    tripService
      .updateTripAccomodation(
        selectedTrip?.id,
        modalAccommodationData?.id,
        jwtToken,
      )
      .then((res) => {
        console.log('res===>', res);
        setModalVisible(false);
        setSelectedAccommodation(modalAccommodationData);
      });
  };

  const selectedTripAccomodation = useMemo(
    () =>
      selectedAccommodation ||
      accommodations.find(
        (acc) => acc.id == selectedTrip?.selected_accomodation?.[1],
      ),
    [selectedTrip, selectedAccommodation, accommodations],
  );

  const formattedSelectedDate = useMemo(() => {
    let date
    try {
      date = format(
        new Date(selectedDate || new Date()),
        'PPP',
      );
    } catch (error) {
      console.log('formattedSelectedDate error==>', error);
      date = selectedDate
    }
    return date
  }, [selectedDate])

  const formattedProposedDate = useCallback((proposedDate) => {
    let date
    try {
      date = format(new Date(proposedDate), 'PPP')
    } catch (error) {
      console.log('formattedProposedDate error==>', error);
      date = proposedDate
    }
    return date
  }, [])

  const formattedTripDate = useMemo(() => {
    let date
    try {
      date = format(new Date(selectedTrip?.selected_date?.replace(/[(),']/g, '')), 'PPP')
    } catch (error) {
      console.log('formattedTripDate error==>', error);
      date = selectedTrip?.selected_date
    }
    return date
  }, [selectedTrip.selected_date])

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
                  {attendee?.attendee?.firstname[0]?.toUpperCase()}
                  {attendee.invite_accepted && (
                    <img
                      src={require('../../../../Assets/Icons/checked.png')}
                      alt=""
                      style={styles.check}
                    />
                  )}
                </div>
                <StyledText>{attendee?.attendee?.firstname}</StyledText>
              </div>
            ))
          ) : (
            <StyledText>No invites sent out yet</StyledText>
          )}
        </div>
        {!!uninvitedUsers.length && (
          <div>
            <StyledText fontWeight={600}>
              Search a  user and click on their name to send an invite
            </StyledText>
            {inviteSent && <StyledText color="green">Invite sent!</StyledText>}
            <Input
                placeholder={'Search user using their first name or surname'}
                width={'100%'}
                customStyles={{marginBottom: 20}}
                onChange={(e) => setUserSearchPhrase(e.target.value)}
              />
            <div style={{ ...styles.flexRowCenter, flexWrap: 'wrap' }}>
              {filteredUninvitedUsers.map((user) => (
                <div
                  style={styles.attendee}
                  onClick={() => invite(user.email)}
                >
                  <div style={{ ...styles.avatar, width: 50, height: 50 }}>
                    {user?.firstname[0]?.toUpperCase()}
                  </div>
                  <StyledText>{user?.firstname} {user.surname}</StyledText>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <StyledText fontSize="20px" fontWeight={700}>
        Trip Date
      </StyledText>
      <div style={{ margin: '20px 0' }}>
        <StyledText fontSize="18px" fontWeight={600}>
          Selected date
        </StyledText>
        {/* {topSeletedDate?.length ?  */}
        {isEdittingDate ? (
          <div>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate || new Date()}
              className={'calendar'}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => {
                  updateTripDate(selectedDate);
                  setIsEdittingDate(false);
                }}
                customStyles={{ marginTop: 10 }}
                label={'Set'}
                width={100}
                height={40}
              />
            </div>
          </div>
        ) : (
          <div style={styles.selectedDateView}>
            <div>
              <div style={styles.flexRowCenter}>
                <img
                  src={require('../../../../Assets/Icons/user.png')}
                  alt="loc"
                  style={{ width: 15, height: 15, marginRight: 5 }}
                />
                <StyledText customStyle={{ marginLeft: 5 }} fontWeight={500}>
                  {userData?.firstname} (Organizer)
                </StyledText>
              </div>
              <div
                style={{
                  ...styles.flexRowCenter,
                  justifyContent: 'space-between',
                }}
              >
                <div style={styles.flexRowCenter}>
                  <img
                    src={require('../../../../Assets/Images/calendar.png')}
                    alt="loc"
                    style={{ width: 15, height: 15, marginRight: 5 }}
                  />
                  <StyledText fontSize="15px">
                    {selectedDate ? formattedSelectedDate : formattedTripDate}
                  </StyledText>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div onClick={() => setIsEdittingDate(true)}>
                <img
                  src={require('../../../../Assets/Icons/edit.png')}
                  alt=""
                  style={styles.edit}
                />
              </div>
              <img
                src={require('../../../../Assets/Icons/checked.png')}
                alt=""
                style={styles.dateCheck}
              />
            </div>
          </div>
        )}
        <StyledText fontSize="18px" fontWeight={600}>
          Proposed dates
        </StyledText>
        <div style={styles.acommodationView}>
          {proposedDates.length ? (
            proposedDates?.map((proposedDate) => (
              <div className="accommodationCardView" style={styles.dateView}>
                <div style={styles.flexRowCenter}>
                  <img
                    src={require('../../../../Assets/Icons/user.png')}
                    alt="loc"
                    style={{ width: 15, height: 15, marginRight: 5 }}
                  />
                  <StyledText
                    customStyle={{ marginLeft: 5, marginBottom: 10 }}
                    fontWeight={500}
                    fontSize="14px"
                  >
                    {proposedDate?.attendee?.firstname}
                  </StyledText>
                </div>
                <div>
                  <div style={styles.flexRowCenter}>
                    <img
                      src={require('../../../../Assets/Images/calendar.png')}
                      alt="loc"
                      style={{ width: 15, height: 15, marginRight: 5 }}
                    />
                    <StyledText fontSize="14px" style={{ marginBottom: 0 }}>
                      {formattedProposedDate(proposedDate?.selected_available_startdate)}
                    </StyledText>
                  </div>
                  {proposedDate.selected_date_reason && (
                    <div>
                      <StyledText fontSize="14px" fontWeight={600}>
                        Reason:{' '}
                      </StyledText>
                      <StyledText fontSize="14px">
                        {proposedDate.selected_date_reason}
                      </StyledText>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {isEqual(
                      new Date(proposedDate.selected_available_startdate),
                      new Date(selectedDate),
                    ) ? (
                      <img
                        src={require('../../../../Assets/Icons/checked.png')}
                        alt=""
                        style={{ ...styles.dateCheck, marginTop: 10 }}
                      />
                    ) : (
                      <Button
                        customStyles={{ marginTop: 10 }}
                        label={'Choose'}
                        width={100}
                        height={40}
                        onClick={() => {
                          updateTripDate(
                            proposedDate?.selected_available_startdate,
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <StyledText>No proposed dates</StyledText>
          )}
        </div>
        <StyledText fontSize="20px" fontWeight={700}>
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
                  setModalAccommodationData(topVotedActivity);
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
        <div
          className="flexRowCenter"
          style={{ justifyContent: 'space-between' }}
        >
          <StyledText fontSize="18px" fontWeight={600}>
            Activities
          </StyledText>
          <Button
            label={'Add activity'}
            height={25}
            width={100}
            onClick={() => {
              setModalType('activity');
              setModalVisible(true);
            }}
          />
        </div>
        {activities.length ? (
          activities.map((activity) => (
            <div
              className="flexRowCenter"
              style={{ justifyContent: 'space-between' }}
            >
              <p>{activity.activity}</p>
              <div
                style={styles.voteBtn}
                onClick={() => {
                  setModalType('activityVotes');
                  setModalVisible(true);
                  setVoters(activity.voters);
                }}
              >
                <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                {activity.votes || 0}
              </div>
            </div>
          ))
        ) : (
          <StyledText>No activities added yet</StyledText>
        )}
        <StyledText fontSize="20px" fontWeight={700}>
          Accomodation
        </StyledText>
        <div
          className="flexRowCenter"
          style={{ justifyContent: 'space-between' }}
        >
          <StyledText fontSize="18px" fontWeight={600}>
            Selected accommodation
          </StyledText>
        </div>
        {selectedTripAccomodation ? (
          <div
            className="flexRowCenter"
            style={{ justifyContent: 'space-between' }}
          >
            <div className="flexRowCenter">
              <p style={{ marginRight: 20 }}>
                {selectedTripAccomodation?.name}
              </p>
              <p style={{ color: 'blue' }}>
                {' '}
                <a
                  href={selectedTripAccomodation?.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedTripAccomodation?.link}
                </a>
              </p>
            </div>
            <div className="flexRowCenter" style={{ paddingTop: 10 }}>
              <img
                src={require('../../../../Assets/Icons/checked.png')}
                alt=""
                style={{
                  ...styles.dateCheck,
                  marginBottom: 10,
                  marginRight: 15,
                }}
              />
              <div
                style={styles.voteBtn}
                onClick={() => {
                  setModalType('accommodationVotes');
                  setModalVisible(true);
                  setVoters(selectedTripAccomodation.voters);
                  setModalAccommodationData(selectedTripAccomodation);
                }}
              >
                <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                {selectedTripAccomodation?.votes || 0}
              </div>
            </div>
          </div>
        ) : (
          <StyledText>Not selected yet</StyledText>
        )}
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
                <p style={{ marginRight: 20 }}>{topVotedAccommodation.name}</p>
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
                  setModalAccommodationData(topVotedAccommodation);
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
        <div
          className="flexRowCenter"
          style={{ justifyContent: 'space-between' }}
        >
          <StyledText fontSize="18px" fontWeight={600}>
            Available accommodations
          </StyledText>
          <Button
            label={'Add accommodation link'}
            height={25}
            width={220}
            onClick={() => {
              setModalType('accommodation');
              setModalVisible(true);
            }}
          />
        </div>
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
                    {' '}
                    <a
                      href={accommodation?.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {accommodation?.link}
                    </a>
                  </p>
                </div>
                <div>
                  <div
                    style={styles.voteBtn}
                    onClick={() => {
                      setModalType('accommodationVotes');
                      setModalVisible(true);
                      setModalAccommodationData(accommodation);
                      setVoters(accommodation.voters);
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                    {accommodation.votes || 0}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <StyledText>No Accommodations added yet</StyledText>
          )}
        </div>
      </div>
      <Modal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        width={isTabletOrMobile ? '90%' : 600}
        maxHeight={'95vh'}
      >
        <div style={{ padding: '10px 20px' }}>
          <div className="tripModalHeader">
            <StyledText fontSize="20px" fontWeight={700}>
              {modalType === 'accommodationVotes'
                ? `Votes for ${modalAccommodationData?.name}`
                : modalType === 'activityVotes'
                ? `Votes`
                : `Add ${modalType}`}
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
              {modalType === 'accommodation' && (
                <>
                  <div>
                    <StyledText fontSize={16}>Accommodation name</StyledText>
                    <Input
                      width={'100%'}
                      placeholder={'e.g. Boxo Diani'}
                      onChange={(e) => setAccommodationName(e.target.value)}
                    />
                  </div>
                  <div>
                    <StyledText fontSize={16}>Link</StyledText>
                    <Input
                      width={'100%'}
                      placeholder={'e.g. https://url/to/accommodation'}
                      onChange={(e) => setAccommodationLink(e.target.value)}
                    />
                  </div>
                </>
              )}
              {modalType === 'activity' && (
                <>
                  <div>
                    <StyledText fontSize={16}>Activity</StyledText>
                    <Input
                      width={'100%'}
                      placeholder={'e.g. Boxo Diani'}
                      onChange={(e) => setActivity(e.target.value)}
                    />
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
                            {voter?.voter?.firstname?.[0]?.toUpperCase()}
                          </div>
                          <StyledText fontSize="14px">
                            {voter?.voter?.firstname}
                          </StyledText>
                        </div>
                        <div
                          style={{
                            minWidth: 100,
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
                  {selectedTripAccomodation?.id !==
                  modalAccommodationData?.id ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 20,
                      }}
                    >
                      <Button
                        onClick={() => {
                          organiserSelectAccomodation();
                          setModalVisible(false);
                        }}
                        label={'Select as trip accomodation'}
                        width={'50%'}
                        height={40}
                      />
                    </div>
                  ) : (
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
                            {voter?.voter?.firstname?.[0]?.toUpperCase()}
                          </div>
                          <StyledText fontSize="14px">
                            {voter?.voter?.firstname}
                          </StyledText>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="btn">
                {(modalType === 'activity' ||
                  modalType === 'accommodation') && (
                  <Button
                    onClick={() => {
                      modalType === 'activity'
                        ? addActivity()
                        : addAccommodation();
                      setModalVisible(false);
                    }}
                    disabled={
                      modalType === 'activity'
                        ? !activity
                        : !accommodationName || !accommodationLink
                    }
                    label={'Done'}
                    width={'50%'}
                    height={40}
                  />
                )}
              </div>
            </FormView>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const styles = {
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
    marginRight: 20,
    cursor: 'pointer',
  },
  check: { position: 'absolute', left: 20, top: 35, width: 20 },
  // dateSelected: { position: 'absolute', left: 20, top: 35, width: 20 },
  dateView: {
    width: 'auto',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid',
    maxWidth: 300,
  },
  selectedDateView: {
    minWidth: '40%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    justifyContent: 'space-between',
  },
  dateCheck: {
    width: 35,
  },
  confirmCheck: {
    width: 40,
  },
  edit: {
    width: 25,
    alignSelf: 'flex-end',
    cursor: 'pointer',
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
  voteBtn: {
    backgroundColor: '#55c2da',
    padding: 5,
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: 15,
  },
};
