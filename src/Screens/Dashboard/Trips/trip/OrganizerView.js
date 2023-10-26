import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CirclesWithBar } from 'react-loader-spinner';

import StyledText from '../../../../Components/Common/StyledText';
import Button from '../../../../Components/Common/Button';
import { tripService } from '../../../../Services/tripService';
import Calendar from 'react-calendar';
import { isEqual } from 'date-fns';
import Input from '../../../../Components/Common/Input';
import { formatDate } from '../../../../Utils/helpers';
import WhatsappContact from '../../../../Components/Common/WhatsappContact';

export default function OrganizerView({
  selectedTrip,
  setPreviewAccommodation,
  setPreviewModalVisible,
  setTripUpdated,
  accommodationsLoading,
  attendees,
  users,
  accommodations,
  proposedDates,
  activities,
  topVotedActivity,
  topVotedAccommodation,
  accommodationData,
  setModalType,
  setModalData,
  setModalVisible,
  setVoters,
  selectedTripaccommodation,
  setInviteSent,
  inviteSent,
  organiserSelectaccommodation,
  voteActivity,
  message,
}) {
  const jwtToken = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [isEdittingDate, setIsEdittingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);
  const [userSearchPhrase, setUserSearchPhrase] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!selectedDate.length) {
      setSelectedDate([
        new Date(selectedTrip?.start_date?.replace(/[(),']/g, '')),
        new Date(selectedTrip?.end_date?.replace(/[(),']/g, '')),
      ]);
    }
  }, []);

  const handleShare = () => {
    setCopiedLink(false);
    const text =
      'Hey friends, click here to be invited to a trip I am currently planning.';
    if (navigator.share) {
      navigator
        .share({
          text,
          url: 'https://traval-tech-portal.netlify.app/register',
          title: 'Explore Africa Portal',
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      console.log('Web Share API not supported on this browser');
      navigator.clipboard
        .writeText(
          text + ' URL: https://traval-tech-portal.netlify.app/register',
        )
        .then(() => {
          setCopiedLink(true);
          setTimeout(() => {
            setCopiedLink(false);
          }, 2000);
        })
        .catch((error) => console.error('Error copying:', error));
    }
  };

  const handleInvite = () => {
    const url = `https://traval-tech-portal.netlify.app/invite/vote/${userData.id}/${selectedTrip?.id}`
    // const url = `http://localhost:3000/invite/vote/${userData.id}/${selectedTrip?.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => {
          setCopiedLink(false);
        }, 2000);
      })
      .catch((error) => console.error('Error copying:', error));
  };

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
      return uninvitedUsers.filter(
        (item) =>
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
            ),
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
    const startDate = new Date(selected_available_startdate[0]);
    const endDate = new Date(selected_available_startdate[1]);

    tripService
      .updateTripDate(selectedTrip.id, startDate, endDate, jwtToken)
      .then((res) => {
        if (res.status === 200) {
          console.log('res==>', res);
          setSelectedDate(selected_available_startdate);
          setTripUpdated((prev) => !prev);
        }
      });
  };

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
              Search a user and click on their name to send an invite
            </StyledText>

            {inviteSent && <StyledText color="green">Invite sent!</StyledText>}
            <Input
              placeholder={'Search user using their first name or surname'}
              width={'100%'}
              customStyles={{ marginBottom: 20 }}
              onChange={(e) => setUserSearchPhrase(e.target.value)}
            />
            <div
              className="flexRowCenter"
              style={{ justifyContent: 'flex-end' }}
            >
              <StyledText
                link
                onClick={handleInvite}
                customStyle={{ marginRight: copiedLink ? 10 : 0 }}
              >
                Copy voting invite link
              </StyledText>
              {copiedLink && (
                <StyledText color="green">Link copied!</StyledText>
              )}
            </div>
            <div style={{ ...styles.flexRowCenter, flexWrap: 'wrap' }}>
              {filteredUninvitedUsers.map((user) => (
                <div style={styles.attendee} onClick={() => invite(user.email)}>
                  <div style={{ ...styles.avatar, width: 50, height: 50 }}>
                    {user?.firstname[0]?.toUpperCase()}
                  </div>
                  <StyledText>
                    {user?.firstname} {user.surname}
                  </StyledText>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={styles.divider} />
      <StyledText fontSize="20px" fontWeight={700}>
        Trip Date
      </StyledText>
      <div style={{ margin: '20px 0' }}>
        <StyledText fontSize="18px" fontWeight={600}>
          Selected date
        </StyledText>
        {isEdittingDate ? (
          <div>
            <Calendar
              onChange={setSelectedDate}
              defaultValue={selectedDate}
              className={'calendar'}
              selectRange
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
                    {selectedDate.length
                      ? formatDate(selectedDate[0]) +
                        ' - ' +
                        formatDate(selectedDate[1])
                      : formatDate(
                          selectedTrip?.start_date?.replace(/[(),']/g, ''),
                        ) +
                        ' - ' +
                        formatDate(
                          selectedTrip?.end_date?.replace(/[(),']/g, ''),
                        )}
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
                    {proposedDate?.user?.firstname}{' '}
                    {proposedDate?.user?.surname}
                  </StyledText>
                </div>
                <div>
                  <div style={{ ...styles.flexRowCenter, flexWrap: 'nowrap' }}>
                    <img
                      src={require('../../../../Assets/Images/calendar.png')}
                      alt="loc"
                      style={{ width: 15, height: 15, marginRight: 5 }}
                    />
                    <div>
                      <StyledText fontSize="14px" style={{ marginBottom: 0 }}>
                        Start:{' '}
                        {formatDate(proposedDate?.selected_available_startdate)}
                      </StyledText>
                      <StyledText fontSize="14px" style={{ marginBottom: 0 }}>
                        End:{' '}
                        {formatDate(proposedDate?.selected_available_enddate)}
                      </StyledText>
                    </div>
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
                      new Date(selectedDate[0]),
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
                        width={65}
                        fontSize="14px"
                        height={30}
                        onClick={() => {
                          updateTripDate([
                            proposedDate?.selected_available_startdate,
                            proposedDate?.selected_available_enddate,
                          ]);
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
        <div style={styles.divider} />
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
                  setModalData(topVotedActivity);
                  setVoters(topVotedActivity.voters);
                }}
              >
                <span style={{ fontWeight: '600' }}>Votes:</span>
                <span style={{ paddingLeft: 5 }}>
                  {topVotedActivity.votes || 0}
                </span>
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
        {activities.length ? (
          activities.map((activity) => (
            <div
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
                    setVoters(activity.voters);
                  }}
                >
                  <span style={{ fontWeight: '600' }}>Votes:</span>{' '}
                  <span style={{ paddingLeft: 5 }}>{activity.votes || 0}</span>
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
          ))
        ) : (
          <StyledText>No activities added yet</StyledText>
        )}
        <div style={styles.divider} />
        <StyledText fontSize="20px" fontWeight={700}>
          Accommodation
        </StyledText>
        <div>
          <p>Want more accommodation options?</p>
          <WhatsappContact
            number="254706673461"
            message={`Hi TripSync, I would love to get accomodation suggestions for my trip: ${selectedTrip?.name} in ${selectedTrip?.destination}.`}
          >
            <div className="flexRowCenter">
              <p style={{ color: 'green' }}>Chat with us</p>
              <img
                src={require('../../../../Assets/Icons/whatsapp.png')}
                style={{ width: 25 }}
              />
            </div>
          </WhatsappContact>
        </div>
        <div
          className="flexRowCenter"
          style={{ justifyContent: 'space-between' }}
        >
          <StyledText fontSize="18px" fontWeight={600}>
            Selected accommodation
          </StyledText>
        </div>
        {!accommodationsLoading && selectedTripaccommodation ? (
          <div
            className="ripple-btn"
            style={{ ...styles.accommodationCardView, width: 'fit-content' }}
            onClick={() => {
              const data = accommodationData(selectedTripaccommodation.name);
              if (data) {
                data.voters = selectedTripaccommodation.voters;
                setPreviewAccommodation(selectedTripaccommodation);
                setPreviewModalVisible(true);
              } else {
                window.open(
                  selectedTripaccommodation.link,
                  '_blank',
                  'rel=noopener noreferrer',
                );
              }
            }}
          >
            <div style={styles.accommodationBox}>
              <img
                src={
                  selectedTripaccommodation?.image ||
                  require('../../../../Assets/Images/Diani_Beach.jpg')
                }
                alt=""
                style={styles.accommodationImg}
              />
              <div
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <StyledText fontWeight={600}>
                  {selectedTripaccommodation?.name}
                </StyledText>
              </div>
              <div
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  ...styles.flexRowCenter,
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{ ...styles.voteBtn, marginRight: 15 }}
                  onClick={() => {
                    setModalType('accommodationVotes');
                    setModalVisible(true);
                    setModalData(selectedTripaccommodation);
                    setVoters(selectedTripaccommodation.voters);
                  }}
                >
                  <StyledText fontSize="14px">
                    Votes: {selectedTripaccommodation?.votes || 0}
                  </StyledText>
                </div>
                {selectedTripaccommodation.rating && (
                  <div>
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
                        {selectedTripaccommodation?.rating}
                      </StyledText>
                    </div>
                  </div>
                )}
                <img
                  src={require('../../../../Assets/Icons/checked.png')}
                  alt=""
                  style={{ ...styles.dateCheck, marginTop: 10 }}
                />
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
          {!accommodationsLoading && topVotedAccommodation ? (
            <div
              className="ripple-btn"
              style={{ ...styles.accommodationCardView, width: 'fit-content' }}
            >
              <div style={styles.accommodationBox}>
                <div
                  style={styles.accommodationImg}
                  onClick={() => {
                    const data = accommodationData(topVotedAccommodation.name);
                    if (data) {
                      data.voters = topVotedAccommodation.voters;
                      setPreviewAccommodation(topVotedAccommodation);
                      setPreviewModalVisible(true);
                    } else {
                      window.open(
                        topVotedAccommodation.link,
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
                  }}
                >
                  <StyledText fontWeight={600}>
                    {topVotedAccommodation?.name}
                  </StyledText>
                </div>
                <div
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    ...styles.flexRowCenter,
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{ ...styles.voteBtn, marginRight: 15 }}
                    onClick={() => {
                      setModalType('accommodationVotes');
                      setModalVisible(true);
                      setModalData(topVotedAccommodation);
                      setVoters(topVotedAccommodation.voters);
                    }}
                  >
                    <StyledText fontSize="14px">
                      Votes: {topVotedAccommodation?.votes || 0}
                    </StyledText>
                  </div>
                  {topVotedAccommodation.rating && (
                    <div>
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
                    </div>
                  )}
                  {console.log(
                    'selectedTrip bool===>',
                    selectedTrip?.selected_accommodation?.replace(
                      /[(),']/g,
                      '',
                    ),
                  )}
                  {console.log(
                    ' topVotedAccommodation bool===>',
                    topVotedAccommodation?.id,
                  )}
                  {selectedTrip?.selected_accommodation?.replace(
                    /[(),']/g,
                    '',
                  ) !== topVotedAccommodation?.id ? (
                    <Button
                      label={'Select'}
                      height={30}
                      width={50}
                      onClick={() =>
                        organiserSelectaccommodation(topVotedAccommodation)
                      }
                      fontSize="13px"
                    />
                  ) : (
                    <img
                      src={require('../../../../Assets/Icons/checked.png')}
                      alt=""
                      style={{ ...styles.dateCheck, marginTop: 10 }}
                    />
                  )}
                </div>
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
            Accommodations
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
                Hang tight as we get more info on the accommodations...
              </StyledText>
            </div>
          ) : accommodations.length ? (
            accommodations.map((accommodation, index) => {
              const data = accommodationData(accommodation.name);
              console.log('data===>', data);
              return (
                <div
                  className="ripple-btn"
                  style={styles.accommodationCardView}
                >
                  <div style={styles.accommodationBox}>
                    <img
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
                      src={
                        data?.image ||
                        data?.photos?.[0]?.pictureUrl ||
                        require('../../../../Assets/Images/Diani_Beach.jpg')
                      }
                      alt=""
                      style={styles.accommodationImg}
                    />
                    <div
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      <StyledText fontWeight={600}>
                        {accommodation?.name}
                      </StyledText>
                    </div>
                    <div
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        ...styles.flexRowCenter,
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        className="flexRowCenter"
                        style={{
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <div
                          style={{ ...styles.voteBtn, marginRight: 15 }}
                          onClick={() => {
                            setModalType('accommodationVotes');
                            setModalVisible(true);
                            setModalData(accommodation);
                            setVoters(accommodation.voters);
                          }}
                        >
                          <p style={{ fontSize: '14px' }}>
                            Votes: {accommodation.votes}
                          </p>
                        </div>
                        <Button
                          label={'Vote'}
                          height={30}
                          width={50}
                          onClick={() => {
                            setModalVisible(true);
                            setModalType('accommodationVote');
                            setModalData(accommodation);
                          }}
                          fontSize="13px"
                        />
                        {data?.rating ||
                          (data?.stars && (
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
                                {data?.rating || data?.stars}
                              </StyledText>
                            </div>
                          ))}
                        {/* {data?.price && (
                          <StyledText fontWeight={500} fontSize="14px">
                            Ksh {data?.price}
                          </StyledText>
                        )} */}
                        {selectedTrip?.selected_accommodation?.replace(
                          /[(),']/g,
                          '',
                        ) !== accommodation?.id ? (
                          <Button
                            label={'Select'}
                            height={30}
                            width={50}
                            onClick={() =>
                              organiserSelectaccommodation(accommodation)
                            }
                            fontSize="13px"
                          />
                        ) : (
                          <img
                            src={require('../../../../Assets/Icons/checked.png')}
                            alt=""
                            style={{ ...styles.dateCheck, marginTop: 10 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <StyledText>No Accommodations added yet</StyledText>
          )}
        </div>
      </div>
      {/* <Modal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
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
                  {selectedTripaccommodation?.id !==
                  modalData?.id ? (
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
                        label={'Select as trip accommodation'}
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
      </Modal> */}
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
    height: 220,
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
    backgroundColor: '#F57878',
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 10,
    cursor: 'pointer',
    height: 30,
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    height: 5,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
};
