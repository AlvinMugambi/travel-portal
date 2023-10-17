import React, { useState, useMemo, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { useMediaQuery } from 'react-responsive';

import { ReactComponent as NotificationIcon } from '../../../Assets/Icons/notification.svg';
import Input from '../../../Components/Common/Input';
import Modal from '../../../Components/Common/Modal';
import StyledText from '../../../Components/Common/StyledText';
import FormView from '../../../Components/Common/FormView';
import Button from '../../../Components/Common/Button';
import Trip from './trip';
import 'react-calendar/dist/Calendar.css';
import '../../../App.css';
import { capitalizeFLetter } from '../../../Utils/helpers';
import { tripService } from '../../../Services/tripService';
import Checkbox from 'rc-checkbox';

export default function Trips({ setDrawerOpen }) {
  const [selectedTrip, setSelectedTrip] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [fixedDate, setFixedDate] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [tripUpdated, setTripUpdated] = useState(false);
  const [userTripsSearchPhrase, setUserTripsSearchPhrase] = useState('');
  const [acceptedTripsSearchPhrase, setAcceptedTripsSearchPhrase] =
    useState('');
  const [invitedTripsSearchPhrase, setinvitedTripsSearchPhrase] = useState('');
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [activity1, setActivity1] = useState('');
  const [activity2, setActivity2] = useState('');
  const [activity3, setActivity3] = useState('');
  const [activity4, setActivity4] = useState('');
  const [activity5, setActivity5] = useState('');
  const [accommodation1, setAccommodation1] = useState({ name: '', link: '' });
  const [accommodation2, setAccommodation2] = useState({ name: '', link: '' });
  const [accommodation3, setAccommodation3] = useState({ name: '', link: '' });
  const [accommodation4, setAccommodation4] = useState({ name: '', link: '' });
  const [accommodation5, setAccommodation5] = useState({ name: '', link: '' });
  const [error, setError] = useState('');
  const [selectedTripDate, setSelectedTripDate] = useState(new Date());
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [mainAgenda, setMainAgenda] = useState([]);

  const [userTrips, setUserTrips] = useState([]);
  const [invitedTrips, setInvitedTrips] = useState([]);
  const [acceptedTrips, setAcceptedTrips] = useState([]);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  useEffect(() => {
    tripService.getUserTrips(jwtToken).then((res) => {
      setUserTrips(res.data || []);
    });
    tripService.getInvitedTrips(jwtToken).then((res) => {
      setInvitedTrips(res.data || []);
    });
    tripService.getAcceptedTrips(jwtToken).then((res) => {
      setAcceptedTrips(res.data || []);
    });
  }, [isSuccessful, tripUpdated, jwtToken]);

  const filteredUserTrips = useMemo(() => {
    if (!userTripsSearchPhrase) {
      return userTrips;
    } else {
      return userTrips.filter((item) =>
        item.name
          .toUpperCase()
          .replaceAll(' ', '')
          .includes(
            userTripsSearchPhrase
              .toUpperCase()
              .trim()
              .replaceAll(' ', '')
              .replace(/\s/g, ''),
          ),
      );
    }
  }, [userTripsSearchPhrase, userTrips]);

  const filteredInvitedTrips = useMemo(() => {
    if (!invitedTripsSearchPhrase) {
      return invitedTrips;
    } else {
      return invitedTrips.filter((item) =>
        item.name
          .toUpperCase()
          .replaceAll(' ', '')
          .includes(
            invitedTripsSearchPhrase
              .toUpperCase()
              .trim()
              .replaceAll(' ', '')
              .replace(/\s/g, ''),
          ),
      );
    }
  }, [invitedTripsSearchPhrase, invitedTrips]);

  const filteredAcceptedTrips = useMemo(() => {
    if (!acceptedTripsSearchPhrase) {
      return acceptedTrips;
    } else {
      return acceptedTrips.filter((item) =>
        item.name
          .toUpperCase()
          .replaceAll(' ', '')
          .includes(
            acceptedTripsSearchPhrase
              .toUpperCase()
              .trim()
              .replaceAll(' ', '')
              .replace(/\s/g, ''),
          ),
      );
    }
  }, [acceptedTripsSearchPhrase, acceptedTrips]);

  const submit = () => {
    if (!tripName || !destination || !selectedTripDate) {
      return;
    }
    let _startDate;
    let _endDate;
    _startDate = format(new Date(selectedTripDate), 'PPP');
    _endDate = format(new Date(selectedTripDate), 'PPP');

    tripService
      .createTrip(
        tripName,
        destination,
        description,
        _startDate,
        _endDate,
        requirements,
        selectedTripDate,
        fixedDate,
        jwtToken,
      )
      .then((res) => {
        if (res.status === 201) {
          setIsSuccessful(!isSuccessful);
          setModalVisible(false);
          const activities = [
            activity1,
            activity2,
            activity3,
            activity4,
            activity5,
          ];
          activities.forEach((activity) => {
            activity &&
              tripService
                .addTripActivity(res.data.id, activity, jwtToken)
                .then((res) => {
                  console.log('res====>', res);
                });
          });

          const accommodations = [
            accommodation1,
            accommodation2,
            accommodation3,
            accommodation4,
            accommodation5,
          ];
          accommodations.forEach((acc) => {
            acc.name &&
              acc.link &&
              tripService
                .addTripAccommodation(res.data.id, acc.name, acc.link, jwtToken)
                .then((res) => {
                  console.log('res====>', res);
                });
          });
        } else {
          setError('Failed to create trip. Kindly try again');
        }
      });
  };

  return (
    <div>
      <div className="header">
        <div className="flexRowCenter">
          {isTabletOrMobile && (
            <div style={{ position: 'relative', left: 10, marginRight: 30 }}>
              <img
                src={require('../../../Assets/Icons/menu.png')}
                width={20}
                onClick={() => setDrawerOpen((prev) => !prev)}
              />
            </div>
          )}
          <StyledText
            fontSize={isTabletOrMobile ? '20px' : '30px'}
            fontWeight={700}
            onClick={() => setSelectedTrip()}
            customStyle={{ cursor: selectedTrip ? 'pointer' : 'default' }}
          >
            Dashboard
          </StyledText>
          {selectedTrip && (
            <div className="flexRowCenter">
              <StyledText
                fontSize={isTabletOrMobile ? '20px' : '20px'}
                fontWeight={700}
                customStyle={{ paddingLeft: 10, paddingRight: 10 }}
              >
                {'>'}
              </StyledText>
              <StyledText
                fontSize={isTabletOrMobile ? '20px' : '30px'}
                fontWeight={700}
              >
                {selectedTrip?.name}
              </StyledText>
            </div>
          )}
        </div>
        <div className="headerRight">
          {/* <NotificationIcon className='notification' /> */}
          <div className="dash-avatar">
            <StyledText fontSize="20px" fontWeight={700}>
              {userData?.username[0]?.toUpperCase()}
            </StyledText>
          </div>
          {!isTabletOrMobile && <p>{capitalizeFLetter(userData?.username)}</p>}
        </div>
      </div>
      {selectedTrip && (
        <StyledText
          onClick={() => setSelectedTrip()}
          link
          customStyle={{ margin: 0, padding: 0 }}
        >
          {'< Back'}
        </StyledText>
      )}

      {!selectedTrip ? (
        <div>
          <div>
            <StyledText fontSize="25px" fontWeight={700}>
              My trips
            </StyledText>
            <div className="filterLayout">
              <Input
                placeholder={'Search your trips'}
                width={isTabletOrMobile ? 200 : 500}
                onChange={(e) => setUserTripsSearchPhrase(e.target.value)}
              />
              <div className="filter">
                <img
                  src={require('../../../Assets/Images/filter.png')}
                  alt=""
                  className="filterImg"
                />
                <StyledText>Filter</StyledText>
              </div>
            </div>
            <div style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap' }}>
              {filteredUserTrips?.map((trip, index) => (
                <div
                  className="tripBox"
                  key={index}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className="smallTripBoxImg">
                    <img
                      src={
                        trip?.image ||
                        require('../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=""
                      className="tripPreview"
                    />
                    <div className="tripAbbr">
                      <div className="avatar">
                        <StyledText fontSize="20px" fontWeight={700}>
                          {trip?.name?.[0]}
                        </StyledText>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <StyledText fontWeight={700} fontSize="18px">
                      {trip?.name}
                    </StyledText>
                    <div className="flexRowCenter">
                      <img
                        src={require('../../../Assets/Images/location.png')}
                        alt="loc"
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                      <StyledText>{trip?.destination}</StyledText>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="addBox"
                onClick={() => {
                  setSelectedTripDate(new Date());
                  setModalVisible(true);
                }}
              >
                <div className="add">
                  <StyledText fontSize="20px" fontWeight={700}>
                    +
                  </StyledText>
                </div>
                <StyledText fontSize="18px" fontWeight={700}>
                  Add trip
                </StyledText>
              </div>
            </div>
          </div>
          <div>
            <StyledText fontSize="25px" fontWeight={700}>
              Invited trips
            </StyledText>
            <div className="filterLayout">
              <Input
                placeholder={'Search invited trips'}
                width={isTabletOrMobile ? 200 : 500}
                onChange={(e) => setinvitedTripsSearchPhrase(e.target.value)}
              />
              <div className="filter">
                <img
                  src={require('../../../Assets/Images/filter.png')}
                  alt=""
                  className="filterImg"
                />
                <StyledText>Filter</StyledText>
              </div>
            </div>
            <div style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap' }}>
              {filteredInvitedTrips?.map((trip, index) => (
                <div
                  className="tripBox"
                  key={index}
                  onClick={() =>
                    setSelectedTrip({
                      ...trip.trip,
                      invite_accepted: trip.invite_accepted,
                      invite_status: trip.invite_status,
                    })
                  }
                >
                  <div className="smallTripBoxImg">
                    <img
                      src={
                        trip?.trip?.image ||
                        require('../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=""
                      className="tripPreview"
                    />
                    <div className="tripAbbr">
                      <div className="avatar">
                        <StyledText fontSize="20px" fontWeight={700}>
                          {trip?.trip?.name?.[0]}
                        </StyledText>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <StyledText fontWeight={700} fontSize="18px">
                      {trip?.trip?.name}
                    </StyledText>
                    <div className="flexRowCenter">
                      <img
                        src={require('../../../Assets/Images/location.png')}
                        alt="loc"
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                      <StyledText>{trip?.trip?.destination}</StyledText>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <StyledText fontSize="25px" fontWeight={700}>
              Confirmed trips
            </StyledText>
            <div className="filterLayout">
              <Input
                placeholder={'Search confirmed trips'}
                width={isTabletOrMobile ? 200 : 500}
                onChange={(e) => setAcceptedTripsSearchPhrase(e.target.value)}
              />
              <div className="filter">
                <img
                  src={require('../../../Assets/Images/filter.png')}
                  alt=""
                  className="filterImg"
                />
                <StyledText>Filter</StyledText>
              </div>
            </div>
            <div style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap' }}>
              {filteredAcceptedTrips?.map((trip, index) => (
                <div
                  className="tripBox"
                  key={index}
                  onClick={() =>
                    setSelectedTrip({
                      ...trip.trip,
                      invite_accepted: trip.invite_accepted,
                      invite_status: trip.invite_status,
                    })
                  }
                >
                  <div className="smallTripBoxImg">
                    <img
                      src={
                        trip?.image ||
                        require('../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=""
                      className="tripPreview"
                    />
                    <div className="tripAbbr">
                      <div className="avatar">
                        <StyledText fontSize="20px" fontWeight={700}>
                          {trip?.trip?.name?.[0]}
                        </StyledText>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <StyledText fontWeight={700} fontSize="18px">
                      {trip?.trip?.name}
                    </StyledText>
                    <div className="flexRowCenter">
                      <img
                        src={require('../../../Assets/Images/location.png')}
                        alt="loc"
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                      <StyledText>{trip?.trip?.destination}</StyledText>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Trip selectedTrip={selectedTrip} setTripUpdated={setTripUpdated} />
      )}
      <Modal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        width={isTabletOrMobile ? '90%' : 500}
        height={isSuccessful ? 'auto' : '95vh'}
        maxHeight={'95vh'}
      >
        <div style={{ padding: '10px 20px' }}>
          {!isSuccessful ? (
            <>
              <div className="tripModalHeader">
                <StyledText fontSize="25px" fontWeight={700}>
                  Create a trip
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
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {error && (
                      <StyledText fontSize="14px" color="red">
                        {error}
                      </StyledText>
                    )}
                  </div>
                  <div>
                    <StyledText fontSize={16}>Trip name</StyledText>
                    <Input
                      width={isTabletOrMobile ? '100%' : 410}
                      placeholder={'e.g. Trip with the boys'}
                      onChange={(e) => setTripName(e.target.value)}
                    />
                  </div>
                  <div>
                    <StyledText fontSize={16}>Destination</StyledText>
                    <Input
                      width={isTabletOrMobile ? '100%' : 410}
                      placeholder={'e.g. Diani'}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                  <div>
                    <StyledText fontSize={16}>Description</StyledText>
                    <Input
                      width={isTabletOrMobile ? '100%' : 410}
                      textArea={true}
                      placeholder={'Describe your trip here'}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="flexRowCenter">
                    <p>
                      <label>
                        <Checkbox
                          name={'fixedDate'}
                          checked={fixedDate}
                          onChange={() => {
                            setSelectedTripDate(new Date());
                            setFixedDate(!fixedDate);
                          }}
                        />
                        &nbsp; Fixed date
                      </label>
                      &nbsp;&nbsp;
                    </p>
                  </div>
                  <div>
                    <StyledText fontSize={16}>
                      Select date
                      {/* {!fixedDate && (
                        <span>
                          {' '}
                          range
                        </span>
                      )} */}
                    </StyledText>
                    <Calendar
                      onChange={setSelectedTripDate}
                      value={selectedTripDate}
                    />
                  </div>
                </FormView>
                <div className="btn">
                  <Button
                    label={'Create trip'}
                    width={isTabletOrMobile ? 320 : 450}
                    onClick={() => {
                      if (!tripName || !destination || !selectedTripDate)
                        return;
                      setIsSuccessful(true);
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="tripModalHeader">
                <StyledText fontSize="25px" fontWeight={700}>
                  One last step!
                </StyledText>
                <div>
                  <StyledText
                    color="black"
                    fontSize="30px"
                    onClick={() => {
                      setIsSuccessful(false);
                      setModalVisible((prev) => !prev);
                    }}
                  >
                    &times;
                  </StyledText>
                </div>
              </div>
              <div className="form">
                <FormView width={isTabletOrMobile ? '100%' : 420}>
                  <div>
                    <div>
                      <StyledText>
                        What is your trip mainly determined by:
                      </StyledText>
                      <div className="flexRowCenter">
                        <p>
                          <label>
                            <Checkbox
                              name={'mainAgenda'}
                              checked={mainAgenda.includes('activities')}
                              onChange={() => {
                                setMainAgenda((prev) => {
                                  if (prev.includes('activities')) {
                                    return prev.filter(
                                      (item) => item !== 'activities',
                                    );
                                  } else return [...prev, 'activities'];
                                });
                              }}
                            />
                            &nbsp; The Activities
                          </label>
                          &nbsp;&nbsp;
                        </p>
                      </div>
                      {mainAgenda.includes('activities') && (
                        <>
                          <StyledText fontSize="14px">
                            List possible activities for the group to vote on
                            the ones they prefer (You can add others later)
                          </StyledText>
                          <Input
                            customStyles={{ marginBottom: 10 }}
                            placeholder={'Activity 1'}
                            width={'100%'}
                            onChange={(e) => setActivity1(e.target.value)}
                          />
                          <Input
                            customStyles={{ marginBottom: 10 }}
                            placeholder={'Activity 2'}
                            width={'100%'}
                            onChange={(e) => setActivity2(e.target.value)}
                          />
                          <Input
                            customStyles={{ marginBottom: 10 }}
                            placeholder={'Activity 3'}
                            width={'100%'}
                            onChange={(e) => setActivity3(e.target.value)}
                          />
                          <Input
                            customStyles={{ marginBottom: 10 }}
                            placeholder={'Activity 4'}
                            width={'100%'}
                            onChange={(e) => setActivity4(e.target.value)}
                          />
                          <Input
                            customStyles={{ marginBottom: 10 }}
                            placeholder={'Activity 5'}
                            width={'100%'}
                            onChange={(e) => setActivity5(e.target.value)}
                          />
                        </>
                      )}
                      <div className="flexRowCenter">
                        <p>
                          <label>
                            <Checkbox
                              name={'mainAgenda'}
                              checked={mainAgenda.includes('accommodation')}
                              onChange={() => {
                                setMainAgenda((prev) => {
                                  if (prev.includes('accommodation')) {
                                    return prev.filter(
                                      (item) => item !== 'accommodation',
                                    );
                                  } else return [...prev, 'accommodation'];
                                });
                              }}
                            />
                            &nbsp; The Accommodation
                          </label>
                          &nbsp;&nbsp;
                        </p>
                      </div>
                      {mainAgenda.includes('accommodation') && (
                        <>
                          <StyledText fontSize="14px">
                            Provide links to the accomodations you would like
                            people to choose from (You can add others later)
                          </StyledText>
                          <div style={{ marginBottom: 20 }}>
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 1 name'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation1((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 1 link'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation1((prev) => ({
                                  ...prev,
                                  link: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 2 name'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation2((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 2 link'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation2((prev) => ({
                                  ...prev,
                                  link: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 3 name'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation3((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 3 link'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation3((prev) => ({
                                  ...prev,
                                  link: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 4 name'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation4((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 4 link'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation4((prev) => ({
                                  ...prev,
                                  link: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 5 name'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation5((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                            <Input
                              customStyles={{ marginBottom: 10 }}
                              placeholder={'Accomodation 5 link'}
                              width={'100%'}
                              onChange={(e) =>
                                setAccommodation5((prev) => ({
                                  ...prev,
                                  link: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <StyledText fontSize={16}>
                      Add notes or requirements for the trip
                    </StyledText>
                    <Input
                      width={'100%'}
                      placeholder={'e.g. Carry sports shoes'}
                      textArea
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>
                  <div className="btn">
                    <Button
                      label={'Done'}
                      width={isTabletOrMobile ? 320 : 450}
                      onClick={() => {
                        submit();
                      }}
                    />
                  </div>
                </FormView>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
