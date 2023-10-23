import React, { useMemo, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import Modal from '../../../../Components/Common/Modal';
import StyledText from '../../../../Components/Common/StyledText';
import Button from '../../../../Components/Common/Button';
import { tripService } from '../../../../Services/tripService';
import Input from '../../../../Components/Common/Input';
import { useMediaQuery } from 'react-responsive';

export default function AccommodationModal({
  accommodation,
  modalVisible,
  setModalVisible,
  tripRegister,
  isTripOrganiser,
}) {
  const [reason, setReason] = useState('');
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  // const voters = useMemo(
  //   () => tripRegister.filter((x) => !!x.selected_accomodation_id),
  //   [tripRegister],
  // );

  const jwtToken = localStorage.getItem('token');

  const inviteeSelectAccomodation = () => {
    console.log('here');
    tripService
      .inviteeUpdatePreferredAccomodation(
        tripRegister?.[0]?.trip?.id,
        accommodation?.id,
        reason,
        jwtToken,
      )
      .then((res) => {
        console.log('res===>', res);
        setModalVisible(false);
      });
  };

  const organiserSelectAccomodation = () => {
    tripService
      .updateTripAccomodation(
        tripRegister?.[0]?.trip?.id,
        accommodation?.id,
        jwtToken,
      )
      .then((res) => {
        console.log('res===>', res);
        setModalVisible(false);
      });
  };

  return (
    <Modal
      isVisible={modalVisible}
      onClose={() => setModalVisible(false)}
      width={'90vw'}
      maxHeight={'93vh'}
    >
      <div className="pad20">
        <div className="modalheader">
          <div className="flexRowCenter">
            <StyledText fontSize="25px" fontWeight={600}>
              {accommodation?.name}
            </StyledText>
            <img
              src={require('../../../../Assets/Images/location.png')}
              alt="loc"
              style={{ width: 15, height: 15, marginRight: 5, marginLeft: 20 }}
            />
            <StyledText fontSize="15px">
              {accommodation?.address?.full}
            </StyledText>
            <img
              src={require('../../../../Assets/Icons/rating.png')}
              alt=""
              style={{ width: 20, marginRight: 5, marginLeft: 20 }}
            />
            <StyledText fontSize="14px">{accommodation?.rating}</StyledText>
          </div>
          <div>
            <StyledText
              color="blue"
              fontSize="30px"
              onClick={() => setModalVisible(false)}
            >
              &times;
            </StyledText>
          </div>
        </div>
        <div className="modalContent">
          <div style={{ width: '100%' }}>
            <Carousel
              autoPlay
              showIndicators={false}
              showStatus={false}
              showThumbs={false}
            >
              {accommodation?.images?.map((image) => (
                <div>
                  <img className="carouselImg" src={image} alt="" />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="accomodationDetails">
            <StyledText fontSize="20px" fontWeight={600}>
              Description
            </StyledText>
            <StyledText fontSize="14px">
              {accommodation?.description}
            </StyledText>
            <StyledText fontSize="20px" fontWeight={600}>
              Category scores
            </StyledText>
            <div className="flex" style={{ flexWrap: 'wrap' }}>
              {accommodation?.categoryReviews?.map((review) => (
                <div
                  className="flex"
                  style={{
                    borderRadius: 10,
                    border: '1px solid grey',
                    padding: 5,
                    marginRight: 10,
                    marginBottom: 10,
                  }}
                >
                  <StyledText
                    fontWeight={500}
                    fontSize="14px"
                    customStyle={{ marginRight: 5 }}
                  >
                    {review?.title}:
                  </StyledText>
                  <StyledText fontSize="14px">{review?.score}</StyledText>
                </div>
              ))}
            </div>
            <StyledText fontSize="20px" fontWeight={600}>
              Time
            </StyledText>
            <StyledText fontSize="14px">
              Check In {accommodation?.checkIn}
            </StyledText>
            <StyledText fontSize="14px">
              Check Out {accommodation?.checkOut}
            </StyledText>
            <StyledText
              fontSize="20px"
              fontWeight={600}
              customStyle={{ marginTop: 30 }}
            >
              Voted by
            </StyledText>
            {!!accommodation?.voters?.length ? (
              <div
                style={{
                  ...styles.flexRowCenter,
                  ...styles.acommodationView,
                }}
              >
                {accommodation?.voters?.map((register) => (
                  <div className="accommodationCardView">
                    <div
                      style={{
                        ...styles.flexRowCenter,
                        border: '1px solid grey',
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
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
                          {register?.user?.[0]?.toUpperCase()}
                        </div>
                        <StyledText fontSize="14px">
                          {register?.user}
                        </StyledText>
                      </div>
                      <StyledText fontSize="14px">
                        {register?.selected_accomodation_reason}
                      </StyledText>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <StyledText customStyle={{ marginTop: 50 }}>
                No votes on this accomodation yet
              </StyledText>
            )}
          </div>
        </div>
        {!!accommodation?.rooms?.length && (
          <div style={{ marginTop: 20 }}>
            <StyledText fontSize="20px" fontWeight={600}>
              Available rooms
            </StyledText>
            <div className="acommodationView">
              {accommodation?.rooms?.map((room) => (
                <div
                  className="ripple-btn accommodationCardView"
                  onClick={() => setModalVisible(true)}
                >
                  <div className="accommodationBox">
                    <div
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <StyledText fontWeight={600}>
                          {room.roomType}
                        </StyledText>
                        <StyledText color="green" fontSize="14px">
                          {room.available ? 'Available' : 'Not available'}
                        </StyledText>
                      </div>
                      <div>
                        <div>
                          <StyledText fontSize="14px">
                            Capacity: {room.persons} persons
                          </StyledText>
                        </div>
                        <StyledText fontWeight={500} fontSize="14px">
                          Price: Ksh 1000
                        </StyledText>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {room.features.map(
                          (feature) =>
                            feature && (
                              <p style={{ fontSize: '12px', marginRight: 10 }}>
                                &#10003; {feature}
                              </p>
                            ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!tripRegister?.[0]?.trip?.selected_accomodation &&
          !isTripOrganiser && (
            <div className="voteReasonLayout">
              <div
                style={{
                  marginRight: isTabletOrMobile ? 0 : 30,
                  marginBottom: isTabletOrMobile ? 10 : 0,
                }}
              >
                <Input
                  height={50}
                  width={isTabletOrMobile ? '80vw' : 500}
                  customStyles={{ border: '1px solid grey', borderRadius: 10 }}
                  placeHolder={
                    'State a reason why you prefer this accommodation'
                  }
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <Button
                label={'Vote for this accommodation'}
                width={isTabletOrMobile ? '100%' : 400}
                onClick={() => {
                  isTripOrganiser
                    ? organiserSelectAccomodation()
                    : inviteeSelectAccomodation();
                }}
              />
            </div>
          )}
        {isTripOrganiser && (
          <div className="voteReasonLayout">
            <Button
              label={'Select this accommodation'}
              width={isTabletOrMobile ? '100%' : 400}
              onClick={() => {
                isTripOrganiser
                  ? organiserSelectAccomodation()
                  : inviteeSelectAccomodation();
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

const styles = {
  pad20: {
    padding: 20,
  },
  carouselImg: {
    width: 550,
    height: 400,
    borderRadius: 10,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
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
    display: 'flex',
    width: 350,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    border: '1px solid grey',
  },
  accommodationCardView: {
    flex: '0 0 auto',
    marginRight: 20,
    cursor: 'pointer',
  },
  accommodationImg: {
    width: '50%',
    height: '100%',
    imageResolution: 'from-image',
    borderRadius: '10px 10px 0 0',
  },
  padLR20: { paddingRight: 20, paddingLeft: 20 },
  attendee: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 50,
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
