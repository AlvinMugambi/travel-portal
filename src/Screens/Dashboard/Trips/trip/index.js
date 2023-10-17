import React, { useState, useMemo, useEffect } from 'react';

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

  useEffect(() => {
    setInviteStatus(selectedTrip.invite_status);
  }, [selectedTrip.invite_status]);

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
                {selectedTrip?.start_date}
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
            <StyledText>{selectedTrip.requirements}</StyledText>
          </div>
        </div>
        <div className="section2">
          {isTripOrganiser ? (
            <OrganizerView
              // tripId={selectedTrip?.id}
              selectedTrip={selectedTrip}
              selectedTripDate={selectedTrip?.selected_date}
              setPreviewAccommodation={setPreviewAccommodation}
              setModalVisible={setModalVisible}
              getAccomodationVotes={getAccomodationVotes}
              accomodationVotes={accomodationVotes}
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
              setTripUpdated={setTripUpdated}
            />
          )}
        </div>
      </div>
      <div className="layout"></div>
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
