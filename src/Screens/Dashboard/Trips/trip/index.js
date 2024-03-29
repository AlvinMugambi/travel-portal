import React, { useState, useMemo, useEffect, useCallback } from 'react';

import { scrapperStaticInput, client } from '../../../../static';
import StyledText from '../../../../Components/Common/StyledText';
import AccommodationModal from './AccommodationModal';
import OrganizerView from './OrganizerView';
import InviteeView from './InviteeView';
import { tripService } from '../../../../Services/tripService';
import { formatDate } from '../../../../Utils/helpers';
import { authService } from '../../../../Services/authService';
import Modal from '../../../../Components/Common/Modal';
import { useMediaQuery } from 'react-responsive';
import Input from '../../../../Components/Common/Input';
import FormView from '../../../../Components/Common/FormView';
import Button from '../../../../Components/Common/Button';

export default function Trip({ selectedTrip, setTripUpdated }) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const [accommodationModalVisible, setaccommodationModalVisible] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteStatus, setInviteStatus] = useState('pending');
  const [previewAccommodation, setPreviewAccommodation] = useState();
  const [tripRegister, setTripRegister] = useState();
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [accommodationVotes, setaccommodationVotes] = useState([]);
  const [scrappedItems, setScrappedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [inviteSent, setInviteSent] = useState(false);
  const [accommodations, setAccommodations] = useState([]);
  const [prefferedDate, setPrefferedDate] = useState(new Date());
  const [hasVotedAccomm, setHasVotedAccomm] = useState(false);
  const [hasVotedActivity, setHasVotedActivity] = useState(false);
  const [modalType, setModalType] = useState('accommodation');
  const [modalData, setModalData] = useState();
  const [accommodationLink, setAccommodationLink] = useState('');
  const [accommodationName, setAccommodationName] = useState('');
  const [activity, setActivity] = useState('');
  const [voters, setVoters] = useState([]);
  const [accommodationReason, setAccommodationReason] = useState('');
  const [message, setMessage] = useState({ label: '', type: '', for: '' });
  const [selectedAccommodation, setSelectedAccommodation] = useState();

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
  }, [selectedTrip?.id, jwtToken, hasVotedActivity]);

  useEffect(() => {
    tripService
      .getTripAccommodations(selectedTrip?.id, jwtToken)
      .then((res) => {
        setAccommodations(res.data || []);
      });
  }, [selectedTrip, jwtToken, hasVotedAccomm]);

  useEffect(() => {
    authService.getUsers().then((res) => {
      setUsers(res.data || []);
    });
  }, []);

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
  console.log('scrapedData===>', scrappedItems);
  useEffect(() => {
    setInviteStatus(selectedTrip.invite_status);
  }, [selectedTrip.invite_status]);

  useEffect(() => {
    // tripService.getaccommodationVotes(selectedTrip?.id, jwtToken).then((res) => {
    //   setaccommodationVotes(res.data || []);
    // });
    tripService.getTripRegister(selectedTrip?.id, jwtToken).then((res) => {
      setTripRegister(res.data);
    });
  }, [modalVisible, jwtToken, selectedTrip?.id]);

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
        setTripUpdated((prev) => !prev);
      });
  };

  const addActivity = () => {
    tripService
      .addTripActivity(selectedTrip?.id, activity, jwtToken)
      .then((res) => {
        console.log('res====>', res);
        setTripUpdated((prev) => !prev);
      });
  };

  const voteAccommodation = (accommodation) => {
    tripService
      .voteForaccommodation(
        selectedTrip?.id,
        accommodation?.id,
        accommodationReason,
        jwtToken,
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

  const voteActivity = (activity) => {
    tripService
      .voteForActivity(selectedTrip?.id, activity?.id, jwtToken)
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

  const organiserSelectaccommodation = (data) => {
    tripService
      .updateTripaccommodation(selectedTrip?.id, data?.id, jwtToken)
      .then(() => {
        setModalVisible(false);
        setTripUpdated((prev) => !prev);
        // setTripUpdated((prev) => !prev) => !prev);
        setSelectedAccommodation(data);
      });
  };

  const isTripOrganiser = useMemo(
    () => userData?.id === selectedTrip.organiser,
    [selectedTrip, userData],
  );

  const getaccommodationVotes = (id) => {
    const acc = accommodationVotes.find(
      (acc) => acc.selected_accommodation_id === id,
    );
    return acc ? acc.dcount : 0;
  };

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

  const selectedTripaccommodation = useMemo(() => {
    const acc =
      selectedAccommodation ||
      accommodations.find(
        (acc) =>
          acc.id ==
          selectedTrip?.selected_accommodation?.replace(/[(),']/g, ''),
      );
    const data = accommodationData(acc?.name);
    if (data) {
      return { ...acc, ...data };
    }
    return acc;
  }, [selectedTrip, selectedAccommodation, accommodations, scrappedItems]);

  return (
    <div>
      <div className="tripLayout">
        <div className="section1">
          <div>
            <img
              src={require('../../../../Assets/Images/Diani_Beach.jpg')}
              className="tripImg"
              alt=""
            />
          </div>
          <StyledText fontSize="25px" fontWeight={700}>
            {selectedTrip.name}
          </StyledText>
          <div className="flexRowCenter">
            <img
              src={require('../../../../Assets/Images/location.png')}
              alt="loc"
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
            <div style={{ marginRight: 20 }}>
              <StyledText fontSize="15px">
                {selectedTrip.destination}
              </StyledText>
            </div>
            <div className="flexRowCenter">
              <img
                src={require('../../../../Assets/Images/calendar.png')}
                alt="loc"
                style={{ width: 15, height: 15, marginRight: 5 }}
              />
              <StyledText fontSize="15px">
                {formatDate(selectedTrip?.start_date)}{' '}
                {selectedTrip?.end_date &&
                  ` - ${formatDate(selectedTrip?.end_date)}`}
              </StyledText>
            </div>
          </div>
          <div>
            <StyledText>{selectedTrip.description}</StyledText>
          </div>
          <div>
            <StyledText fontSize="18px" fontWeight={600}>
              Notes/Requirements
            </StyledText>
            <StyledText>{selectedTrip.requirements || '---'}</StyledText>
          </div>
        </div>
        <div className="section2">
          {isTripOrganiser ? (
            <OrganizerView
              selectedTrip={selectedTrip}
              selectedTripDate={selectedTrip?.selected_date}
              setPreviewAccommodation={setPreviewAccommodation}
              setPreviewModalVisible={setaccommodationModalVisible}
              getaccommodationVotes={getaccommodationVotes}
              accommodationVotes={accommodationVotes}
              setTripUpdated={setTripUpdated}
              accommodationsLoading={loading}
              attendees={attendees}
              users={users}
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
              accommodationName={accommodationName}
              setAccommodationName={setAccommodationName}
              setAccommodationLink={setAccommodationLink}
              accommodationLink={accommodationLink}
              setModalVisible={setModalVisible}
              selectedTripaccommodation={selectedTripaccommodation}
              setInviteSent={setInviteSent}
              message={message}
              organiserSelectaccommodation={organiserSelectaccommodation}
              voteActivity={voteActivity}
            />
          ) : (
            <InviteeView
              inviteStatus={inviteStatus}
              setInviteStatus={setInviteStatus}
              setPrefferedDate={setPrefferedDate}
              prefferedDate={prefferedDate}
              setPreviewAccommodation={setPreviewAccommodation}
              selectedTrip={selectedTrip}
              getaccommodationVotes={getaccommodationVotes}
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
              setInviteSent={setInviteSent}
            />
          )}
        </div>
      </div>
      <div className="layout"></div>
      <AccommodationModal
        modalVisible={accommodationModalVisible}
        setModalVisible={setaccommodationModalVisible}
        accommodation={previewAccommodation}
        tripRegister={tripRegister}
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
          <div className="form">
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
                  {selectedTripaccommodation?.id !== modalData?.id ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 20,
                      }}
                    >
                      <Button
                        onClick={() => {
                          organiserSelectaccommodation();
                          setModalVisible(false);
                        }}
                        label={'Select'}
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
                        Selected as preferred accommodation
                      </StyledText>
                    </div>
                  )}
                </>
              )}
              {console.log('voters===>', voters)}
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
