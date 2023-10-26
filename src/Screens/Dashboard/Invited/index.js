import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripService } from '../../../Services/tripService';
import StyledText from '../../../Components/Common/StyledText';
import InviteeView from '../Trips/trip/InviteeView';
import { formatDate } from '../../../Utils/helpers';
import AccommodationModal from '../Trips/trip/AccommodationModal';
import Modal from '../../../Components/Common/Modal';
import { scrapperStaticInput, client } from '../../../static';
import { useMediaQuery } from 'react-responsive';
import FormView from '../../../Components/Common/FormView';
import Input from '../../../Components/Common/Input';
import Button from '../../../Components/Common/Button';
import { authService } from '../../../Services/authService';

export default function Invited() {
  const { userId, tripId } = useParams();
  const jwtToken = localStorage.getItem('token');
  const [trip, setTrip] = useState();
  const [inviteStatus, setInviteStatus] = useState('pending');
  const [prefferedDate, setPrefferedDate] = useState(new Date());
  const [previewAccommodation, setPreviewAccommodation] = useState();
  const [tripUpdated, setTripUpdated] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [accommodationModalVisible, setaccommodationModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [voters, setVoters] = useState([]);
  const [users, setUsers] = useState([]);
  const [scrappedItems, setScrappedItems] = useState({});
  const [modalType, setModalType] = useState('accommodation');
  const [modalData, setModalData] = useState();
  const [message, setMessage] = useState('');
  const [accommodationName, setAccommodationName] = useState('');
  const [accommodationLink, setAccommodationLink] = useState('');
  const [accommodationReason, setAccommodationReason] = useState('');
  const [activity, setActivity] = useState('');
  const [voterName, setVoterName] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState();
  const [hasVotedAccomm, setHasVotedAccomm] = useState(false);
  const [hasVotedActivity, setHasVotedActivity] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  const navigate = useNavigate();
  useEffect(() => {
    authService.getUsers().then((res) => {
      setUsers(res.data || []);
    });
  }, []);

  const user = useMemo(() => {
    return users.find((user) => {
      return Number(userId) === Number(user.id);
    });
  }, [userId, users]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const scrapedData = {};

      for (const acc of accommodations) {
        const { name, link } = acc;
        let actor;
        if (link.includes('airbnb')) {
          actor = 'GsNzxEKzE2vQ5d9HN';
        } else {
          actor = 'QGcJvQyG9NqMKTYPH';
        }
        const { defaultDatasetId } = await client.actor(actor).call({
          ...scrapperStaticInput,
          search: name,
          startUrls: [{ url: link }],
        });
        try {
          const res = await client.dataset(defaultDatasetId).listItems();
          scrapedData[name] = res.items;
        } catch (error) {
          console.error(`Error fetching data for ${name}:`, error);
        }
      }

      setScrappedItems((prevItems) => ({
        ...prevItems,
        ...scrapedData,
      }));
      setLoading(false);
    };

    fetchData();
  }, [accommodations]);

  useEffect(() => {
    tripService.getTripRegister(tripId, jwtToken).then((res) => {
      console.log('res====>', res);
      setTrip(res.data);
    });
  }, []);

  useEffect(() => {
    tripService.getTripAttendees(tripId, jwtToken).then((res) => {
      setAttendees(res.data || []);
    });
    tripService.getTripProposedDates(tripId, jwtToken).then((res) => {
      setProposedDates(res.data || []);
    });
  }, [jwtToken, tripId]);

  useEffect(() => {
    tripService.getTripActivities(tripId, jwtToken).then((res) => {
      setActivities(res.data || []);
    });
  }, [trip, jwtToken, hasVotedActivity]);

  useEffect(() => {
    tripService.getTripAccommodations(tripId, jwtToken).then((res) => {
      setAccommodations(res.data || []);
    });
  }, [trip, jwtToken, hasVotedAccomm]);

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

  const accommodationData = useCallback(
    (accommodationName) => {
      return scrappedItems?.[accommodationName]?.find((item) =>
        item.name.includes(accommodationName),
      );
    },
    [scrappedItems],
  );

  const topVotedAccommodation = useMemo(() => {
    const filteredObjects = accommodations.filter((obj) => obj.votes > 0);
    if (filteredObjects.length === 0) {
      return null;
    }
    const maxVotesObject = filteredObjects.reduce((maxObj, currentObj) => {
      return currentObj.votes > maxObj.votes ? currentObj : maxObj;
    });

    const data = accommodationData(maxVotesObject?.name);
    if (data) {
      return { ...maxVotesObject, ...data };
    }
    return maxVotesObject;
  }, [accommodations, scrappedItems]);

  const voteActivity = (activity) => {
    tripService
      .voteForActivity(tripId, activity?.id, jwtToken, voterName)
      .then((res) => {
        if (res.status === 200) {
          setHasVotedActivity((prev) => !prev);
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
      .voteForaccommodation(
        tripId,
        accommodation.id,
        accommodationReason,
        jwtToken,
        voterName,
      )
      .then((res) => {
        if (res.status === 200) {
          setHasVotedAccomm((prev) => !prev);
          setTripUpdated((prev) => !prev);
          setMessage({
            label: 'Voted added',
            type: 'success',
            for: 'accommodation',
          });
          setTimeout(() => {
            setMessage({ label: '', type: '', for: '' });
            setModalVisible(false);
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

  const selectedTripaccommodation = useMemo(() => {
    const acc =
      selectedAccommodation ||
      accommodations.find(
        (acc) => acc.id == trip?.selected_accommodation?.replace(/[(),']/g, ''),
      );
    const data = accommodationData(acc?.name);
    if (data) {
      return { ...acc, ...data };
    }
    return acc;
  }, [trip, selectedAccommodation, accommodations, scrappedItems]);

  const isTripOrganiser = useMemo(
    () => userId === trip?.organiser,
    [userId, trip],
  );

  const addAccommodation = () => {
    tripService
      .addTripAccommodation(
        tripId,
        accommodationName,
        accommodationLink,
        jwtToken,
      )
      .then((res) => {
        console.log('res====>', res);
        setTripUpdated((prev) => !prev);
      });
  };

  const addActivity = () => {
    tripService.addTripActivity(tripId, activity, jwtToken).then((res) => {
      console.log('res====>', res);
      setTripUpdated((prev) => !prev);
    });
  };

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          justifyContent: 'space-between',
          boxShadow: '1px 0px 27px 0px rgba(0,0,0,0.75)',
          marginBottom: 20,
        }}
      >
        <img
          src={require('../../../Assets/Images/Logo/logo.png')}
          alt=""
          className="img"
        />
        <div className="flexRowCenter" style={{ marginRight: 30 }}>
          <StyledText
            link
            customStyle={{ paddingRight: 20 }}
            onClick={() => navigate('/Register')}
          >
            Sign Up
          </StyledText>
          <Button
            label={'Sign In'}
            height={30}
            width={80}
            backgroundColor={'#F57878'}
            onClick={() => navigate('/Login')}
          />
        </div>
      </div>
      <div style={{ marginLeft: 20 }}>
        <StyledText fontSize="20px" fontWeight={600}>
          Invitation from {user?.firstname}
        </StyledText>
      </div>
      <div className="tripLayout invitePage">
        <div className="section1">
          <div>
            <img
              src={require('../../../Assets/Images/Diani_Beach.jpg')}
              className="tripImg"
              alt=""
            />
          </div>
          <StyledText fontSize="25px" fontWeight={700}>
            {trip?.name}
          </StyledText>
          <div className="flexRowCenter">
            <img
              src={require('../../../Assets/Images/location.png')}
              alt="loc"
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
            <div style={{ marginRight: 20 }}>
              <StyledText fontSize="15px">{trip?.destination}</StyledText>
            </div>
            <div className="flexRowCenter">
              <img
                src={require('../../../Assets/Images/calendar.png')}
                alt="loc"
                style={{ width: 15, height: 15, marginRight: 5 }}
              />
              <StyledText fontSize="15px">
                {formatDate(trip?.start_date)}{' '}
                {trip?.end_date && ` - ${formatDate(trip?.end_date)}`}
              </StyledText>
            </div>
          </div>
          <div>
            <StyledText>{trip?.description}</StyledText>
          </div>
          <div>
            <StyledText fontSize="18px" fontWeight={600}>
              Notes/Requirements
            </StyledText>
            <StyledText>{trip?.requirements || '---'}</StyledText>
          </div>
        </div>
        <div className="section2">
          <InviteeView
            nonUser={true}
            setVoterName={setVoterName}
            voterName={voterName}
            inviteStatus={inviteStatus}
            setInviteStatus={setInviteStatus}
            setPrefferedDate={setPrefferedDate}
            prefferedDate={prefferedDate}
            setPreviewAccommodation={setPreviewAccommodation}
            selectedTrip={trip}
            setTripUpdated={setTripUpdated}
            setPreviewModalVisible={setaccommodationModalVisible}
            accommodationsLoading={loading}
            attendees={attendees}
            accommodations={accommodations}
            proposedDates={proposedDates}
            activities={activities}
            topVotedActivity={topVotedActivity}
            topVotedAccommodation={topVotedAccommodation}
            accommodationData={accommodationData}
            setModalType={setModalType}
            setModalData={setModalData}
            modalData={modalData}
            setVoters={setVoters}
            message={message}
            voteActivity={voteActivity}
            setModalVisible={setModalVisible}
            selectedTripaccommodation={selectedTripaccommodation}
          />
        </div>
      </div>
      <div className="layout"></div>
      <AccommodationModal
        modalVisible={accommodationModalVisible}
        setModalVisible={setaccommodationModalVisible}
        accommodation={previewAccommodation}
        tripRegister={trip}
        isTripOrganiser={isTripOrganiser}
      />
      <Modal
        isVisible={modalVisible}
        onClose={() => {
          setMessage({ label: '', type: '', for: '' });
          setModalVisible(false);
        }}
        width={isTabletOrMobile ? '90%' : 600}
        maxHeight={'95vh'}
      >
        <div style={{ padding: '10px 20px' }}>
          <div className="tripModalHeader">
            <StyledText fontSize="20px" fontWeight={700}>
              {modalType === 'accommodationVotes'
                ? `Votes for ${modalData?.name}`
                : modalType === 'activityVotes'
                ? `Votes`
                : modalType === 'accommodationVote'
                ? `Vote for ${modalData?.name}`
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
          <div className="form padb10">
            <FormView width={'100%'}>
              {message.label && (
                <StyledText
                  fontSize="16px"
                  fontWeight={600}
                  color={message.type === 'error' ? 'red' : 'green'}
                  customStyle={{ marginTop: 10, marginBottom: 10 }}
                >
                  {message.label}
                </StyledText>
              )}
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
                            {(voter?.voter?.firstname ||
                              voter?.voter_name)?.[0]?.toUpperCase()}
                          </div>
                          <StyledText fontSize="14px">
                            {voter?.voter?.firstname || voter?.voter_name}
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
                  {/* <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={require('../../../Assets/Icons/checked.png')}
                      alt=""
                      style={styles.confirmCheck}
                    />
                    <StyledText customStyle={{ textAlign: 'center' }}>
                      Selected as preferred accommodation
                    </StyledText>
                  </div> */}
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
                            {(voter?.voter?.firstname ||
                              voter?.voter_name)?.[0]?.toUpperCase()}
                          </div>
                          <StyledText fontSize="14px">
                            {voter?.voter?.firstname || voter?.voter_name}
                          </StyledText>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {modalType === 'accommodationVote' && (
                <div>
                  <div>
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
                      width={'100%'}
                      onClick={() => {
                        voteAccommodation(modalData);
                      }}
                    />
                  </div>
                </div>
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
  attendee: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10,
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
};
