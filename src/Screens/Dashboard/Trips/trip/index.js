import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';

import StyledText from '../../../../Components/Common/StyledText';
import AccommodationModal from './AccommodationModal';
import OrganizerView from './OrganizerView';
import InviteeView from './InviteeView';
import { tripService } from '../../../../Services/tripService';

export default function Trip({ selectedTrip, setTripUpdated }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteStatus, setInviteStatus] = useState('pending');
  const [previewaccommodation, setPreviewAccommodation] = useState();
  const [tripRegister, setTripRegister] = useState([]);
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [accomodationVotes, setAccomodationVotes] = useState([]);
  const [topSeletedDate, setTopSeletedDate] = useState();

  useEffect(() => {
    setInviteStatus(selectedTrip.invite_status);
  }, [selectedTrip.invite_status]);

  useEffect(() => {
    tripService.getTopVotedDate(selectedTrip?.id, jwtToken).then((res) => {
      setTopSeletedDate(res.data || []);
    });
  }, [jwtToken, selectedTrip.id]);

  useEffect(() => {
    tripService.getAccomodationVotes(selectedTrip?.id, jwtToken).then((res) => {
      setAccomodationVotes(res.data || []);
    });
    tripService.getTripRegister(selectedTrip?.id, jwtToken).then((res) => {
      setTripRegister(res.data || []);
    });
  }, [modalVisible, jwtToken, selectedTrip.id]);

  const isTripOrganiser = useMemo(
    () => userData?.id === selectedTrip.organiser,
    [selectedTrip, userData],
  );

  const getAccomodationVotes = (id) => {
    const acc = accomodationVotes.find(
      (acc) => acc.selected_accomodation_id === id,
    );
    return acc ? acc.dcount : 0;
  };

  const [prefferedDate, setPrefferedDate] = useState(new Date());

  return (
    <div>
      <div style={styles.flexRowCenter}>
        <div
          style={{
            width: '50vw',
            height: '70vh',
            borderRight: '1px solid grey',
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
          }}
        >
          <div>
            <img
              src={require('../../../../Assets/Images/Diani_Beach.jpg')}
              style={{
                width: '100%',
                borderRadius: '10px 10px 0 0',
                height: 300,
              }}
              alt=''
            />
          </div>
          <StyledText fontSize="25px" fontWeight={700}>
            {selectedTrip.name}
          </StyledText>
          <div style={styles.flexRowCenter}>
            <img
              src={require('../../../../Assets/Images/location.png')}
              alt="loc"
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
            <StyledText fontSize="15px">{selectedTrip.destination}</StyledText>
            <div style={{ marginLeft: 20 }}>
              <img
                src={require('../../../../Assets/Images/calendar.png')}
                alt="loc"
                style={{ width: 15, height: 15, marginRight: 5 }}
              />
            </div>
            <StyledText fontSize="15px">
              {format(new Date(selectedTrip.start_date), 'PPP')} -{' '}
              {format(new Date(selectedTrip.end_date), 'PPP')}
            </StyledText>
          </div>
          <div>
            <StyledText>{selectedTrip.description}</StyledText>
          </div>
          <div>
            <StyledText fontSize="18px" fontWeight={600}>
              Notes/Requirements
            </StyledText>
            <StyledText>{selectedTrip.requirements}</StyledText>
          </div>
        </div>
        <div
          style={{
            width: '50vw',
            height: '75vh',
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
            overflowY: 'scroll',
          }}
        >
          {isTripOrganiser ? (
            <OrganizerView
              tripId={selectedTrip?.id}
              setPreviewAccommodation={setPreviewAccommodation}
              setModalVisible={setModalVisible}
              getAccomodationVotes={getAccomodationVotes}
              accomodationVotes={accomodationVotes}
              topSeletedDate={topSeletedDate}
            />
          ) : (
            <InviteeView
              inviteStatus={inviteStatus}
              setInviteStatus={setInviteStatus}
              setPrefferedDate={setPrefferedDate}
              prefferedDate={prefferedDate}
              setPreviewAccommodation={setPreviewAccommodation}
              setModalVisible={setModalVisible}
              selectedTrip={selectedTrip}
              getAccomodationVotes={getAccomodationVotes}
              topSeletedDate={topSeletedDate}
              setTripUpdated={setTripUpdated}
            />
          )}
        </div>
      </div>
      <div style={styles.layout}></div>
      <AccommodationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        accommodation={previewaccommodation}
        tripRegister={tripRegister}
        isTripOrganiser={isTripOrganiser}
      />
    </div>
  );
}

const styles = {
  layout: { marginTop: 50, display: 'flex', flexWrap: 'wrap' },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripBox: {
    borderRadius: 10,
    width: 275,
    height: 180,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    cursor: 'pointer',
    marginRight: 30,
    marginBottom: 30,
  },
  tripBoxImg: {
    height: '50%',
    backgroundColor: 'rgba(25, 184, 123, 0.60)',
    borderRadius: '10px 10px 0 0',
    paddingLeft: 20,
    paddingTop: 20,
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  add: {
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
  nameField: {
    justifyContent: 'space-between',
    width: 430,
  },
  pad10: { padding: 10 },
  pad20: { padding: 20 },
  locationImg: { width: 20, height: 20, marginRight: 5 },
  addBox: {
    borderRadius: 10,
    width: 275,
    height: 180,
    display: 'flex',
    backgroundColor: 'white',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { display: 'flex', alignItems: 'center', flexDirection: 'column' },
  padb10: { paddingBottom: 10 },
  flexAlignCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  dropdownLayout: {
    height: 'auto',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '10px',
    position: 'absolute',
    boxShadow: '-1px 4px 9px -8px rgba(0,0,0,0.75)',
  },
  dropdownItem: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    padding: '5px 10px 5px 10px',
    cursor: 'pointer',
  },
};
