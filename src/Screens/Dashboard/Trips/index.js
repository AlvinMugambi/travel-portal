import React, { useState, useMemo, useEffect } from 'react';
import Calendar from 'react-calendar';
import Checkbox from 'rc-checkbox';
import { format } from 'date-fns';

import { ReactComponent as NotificationIcon } from '../../../Assets/Icons/notification.svg';
import Input from '../../../Components/Common/Input';
import Modal from '../../../Components/Common/Modal';
import StyledText from '../../../Components/Common/StyledText';
import FormView from '../../../Components/Common/FormView';
import Button from '../../../Components/Common/Button';
import Trip from './trip';
import 'react-calendar/dist/Calendar.css';
import 'rc-checkbox/assets/index.css';
import '../../../App.css';
import { capitalizeFLetter } from '../../../Utils/helpers';
import { tripService } from '../../../Services/tripService';

export default function Trips() {
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
  const [error, setError] = useState('');
  const [prefferedDate, setPrefferedDate] = useState(new Date());
  // const userData = useRecoilValue(UserData);
  // const jwtToken = useRecoilValue(JwtTokenState);
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));

  const [userTrips, setUserTrips] = useState([]);
  const [invitedTrips, setInvitedTrips] = useState([]);
  const [acceptedTrips, setAcceptedTrips] = useState([]);

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
    let _startDate;
    let _endDate;
    if (fixedDate) {
      _startDate = format(prefferedDate, 'yyyy-MM-dd');
      _endDate = format(prefferedDate, 'yyyy-MM-dd');
    } else {
      _startDate = format(prefferedDate[0], 'yyyy-MM-dd');
      _endDate = format(prefferedDate[1], 'yyyy-MM-dd');
    }

    tripService
      .createTrip(
        tripName,
        destination,
        description,
        _startDate,
        _endDate,
        requirements,
        fixedDate,
        jwtToken,
      )
      .then((res) => {
        if (res.status === 201) {
          setIsSuccessful(!isSuccessful);
          setModalVisible(false);
        } else {
          setError('Failed to create trip. Kindly try again');
        }
      });
  };

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.flexRowCenter}>
          <StyledText
            fontSize="30px"
            fontWeight={700}
            onClick={() => setSelectedTrip()}
            customStyle={{ cursor: selectedTrip ? 'pointer' : 'default' }}
          >
            Dashboard
          </StyledText>
          {selectedTrip && (
            <div style={styles.flexRowCenter}>
              <StyledText
                fontSize="20px"
                fontWeight={700}
                customStyle={{ paddingLeft: 10, paddingRight: 10 }}
              >
                {'>'}
              </StyledText>
              <StyledText fontSize="30px" fontWeight={700}>
                {selectedTrip?.name}
              </StyledText>
            </div>
          )}
        </div>
        <div style={styles.headerRight}>
          <NotificationIcon style={styles.notification} />
          <div style={styles.avatar}>
            <StyledText fontSize="20px" fontWeight={700}>
              {userData?.username[0]?.toUpperCase()}
            </StyledText>
          </div>
          <p>{capitalizeFLetter(userData?.username)}</p>
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
            <div style={styles.flexRowCenter}>
              <Input
                placeHolder={'Search your trips'}
                width={500}
                onChange={(e) => setUserTripsSearchPhrase(e.target.value)}
              />
              <div style={styles.filter}>
                <img
                  src={require('../../../Assets/Images/filter.png')}
                  alt=''
                  style={styles.filterImg}
                />
                <StyledText>Filter</StyledText>
              </div>
            </div>
            <div style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap' }}>
              {filteredUserTrips?.map((trip, index) => (
                <div
                  style={styles.tripBox}
                  key={index}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div style={styles.tripBoxImg}>
                    <img
                      src={
                        trip?.image ||
                        require('../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=''
                      style={{
                        width: 275,
                        height: '100%',
                        borderRadius: '10px 10px 0 0',
                      }}
                    />
                    <div style={{ position: 'relative', top: -50, left: 10 }}>
                      <div style={styles.avatar}>
                        <StyledText fontSize="20px" fontWeight={700}>
                          {trip?.name?.[0]}
                        </StyledText>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 10 }}>
                    <StyledText fontWeight={700} fontSize="18px">
                      {trip?.name}
                    </StyledText>
                    <div style={styles.flexRowCenter}>
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
                style={styles.addBox}
                onClick={() => {
                  setPrefferedDate(new Date());
                  setModalVisible(true);
                }}
              >
                <div style={styles.add}>
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
            <div style={styles.flexRowCenter}>
              <Input
                placeHolder={'Search invited trips'}
                width={500}
                onChange={(e) => setinvitedTripsSearchPhrase(e.target.value)}
              />
              <div style={styles.filter}>
                <img
                  src={require('../../../Assets/Images/filter.png')}
                  alt=''
                  style={styles.filterImg}
                />
                <StyledText>Filter</StyledText>
              </div>
            </div>
            <div style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap' }}>
              {filteredInvitedTrips?.map((trip, index) => (
                <div
                  style={styles.tripBox}
                  key={index}
                  onClick={() =>
                    setSelectedTrip({
                      ...trip.trip,
                      invite_accepted: trip.invite_accepted,
                      invite_status: trip.invite_status,
                    })
                  }
                >
                  <div style={styles.tripBoxImg}>
                    <img
                      src={
                        trip?.trip?.image ||
                        require('../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=''
                      style={{
                        width: 275,
                        height: '100%',
                        borderRadius: '10px 10px 0 0',
                      }}
                    />
                    <div style={{ position: 'relative', top: -50, left: 10 }}>
                      <div style={styles.avatar}>
                        <StyledText fontSize="20px" fontWeight={700}>
                          {trip?.trip?.name?.[0]}
                        </StyledText>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 10 }}>
                    <StyledText fontWeight={700} fontSize="18px">
                      {trip?.trip?.name}
                    </StyledText>
                    <div style={styles.flexRowCenter}>
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
            <div style={styles.flexRowCenter}>
              <Input
                placeHolder={'Search confirmed trips'}
                width={500}
                onChange={(e) => setAcceptedTripsSearchPhrase(e.target.value)}
              />
              <div style={styles.filter}>
                <img
                  src={require('../../../Assets/Images/filter.png')}
                  alt=''
                  style={styles.filterImg}
                />
                <StyledText>Filter</StyledText>
              </div>
            </div>
            <div style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap' }}>
              {filteredAcceptedTrips?.map((trip, index) => (
                <div
                  style={styles.tripBox}
                  key={index}
                  onClick={() =>
                    setSelectedTrip({
                      ...trip.trip,
                      invite_accepted: trip.invite_accepted,
                      invite_status: trip.invite_status,
                    })
                  }
                >
                  <div style={styles.tripBoxImg}>
                    <img
                      src={
                        trip?.image ||
                        require('../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=''
                      style={{
                        width: 275,
                        height: '100%',
                        borderRadius: '10px 10px 0 0',
                      }}
                    />
                    <div style={{ position: 'relative', top: -50, left: 10 }}>
                      <div style={styles.avatar}>
                        <StyledText fontSize="20px" fontWeight={700}>
                          {trip?.trip?.name?.[0]}
                        </StyledText>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 10 }}>
                    <StyledText fontWeight={700} fontSize="18px">
                      {trip?.trip?.name}
                    </StyledText>
                    <div style={styles.flexRowCenter}>
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
        width={500}
      >
        <div style={{ padding: '10px 20px' }}>
          {!isSuccessful ? (
            <>
              <StyledText
                fontSize="25px"
                fontWeight={700}
                customStyle={{ paddingBottom: 10 }}
              >
                Create a trip
              </StyledText>
              <div style={styles.form}>
                <FormView width={420}>
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
                      width={410}
                      placeHolder={'e.g. Trip with the boys'}
                      onChange={(e) => setTripName(e.target.value)}
                    />
                  </div>
                  <div>
                    <StyledText fontSize={16}>Destination</StyledText>
                    <Input
                      width={410}
                      placeHolder={'e.g. Diani'}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                  <div>
                    <StyledText fontSize={16}>Description</StyledText>
                    <Input
                      width={410}
                      textArea={true}
                      placeHolder={'Describe your trip here'}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div style={styles.flexRowCenter}>
                    <p>
                      <label>
                        <Checkbox
                          name={'fixedDate'}
                          checked={fixedDate}
                          onChange={() => {
                            setPrefferedDate(new Date());
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
                      {!fixedDate && (
                        <span>
                          {' '}
                          range{' '}
                          <span style={{ fontSize: '15px' }}>
                            {' '}
                            (date range within when the trip should happen)
                          </span>
                        </span>
                      )}
                    </StyledText>
                    <Calendar
                      onChange={setPrefferedDate}
                      value={prefferedDate}
                      selectRange={!fixedDate}
                    />
                  </div>
                </FormView>
                <div style={styles.btn}>
                  <Button
                    label={'Create trip'}
                    width={450}
                    onClick={() => {
                      setIsSuccessful(true);
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <StyledText
                fontSize="25px"
                fontWeight={700}
                customStyle={{ paddingBottom: 10 }}
              >
                One last step!
              </StyledText>
              <div style={styles.form}>
                <FormView width={420}>
                  <div>
                    <StyledText fontSize={16}>
                      Add notes or requirements for the trip
                    </StyledText>
                    <Input
                      width={410}
                      placeHolder={'e.g. Carry sports shoes'}
                      textArea
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>
                  <div style={styles.btn}>
                    <Button
                      label={'Done'}
                      width={450}
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

const styles = {
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 100,
    borderRadius: 10,
    height: 40,
    marginTop: 10,
    marginLeft: 10,
  },
  filterImg: { width: 20, height: 20, marginRight: 10 },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notification: {
    marginRight: 30,
    width: 30,
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
    marginRight: 10,
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
    // backgroundColor: 'rgba(25, 184, 123, 0.60)',
    borderRadius: '10px 10px 0 0',
    // paddingLeft: 20,
    // paddingTop: 20,
  },
  pad20: { padding: 20 },
  btn: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
  },
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
};
