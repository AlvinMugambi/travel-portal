import axios from 'axios';
// const BASE_URL = 'https://nairobiservices.go.ke/api/travel';
const BASE_URL = 'http://127.0.0.1:8000';

const createTrip = async (
  trip_name,
  destination,
  description,
  start_date,
  end_date,
  requirements,
  selected_date,
  date_is_locked,
  jwtToken,
) => {
  return axios
    .post(
      `${BASE_URL}/trips/create`,
      {
        trip_name,
        destination,
        description,
        start_date,
        end_date,
        requirements,
        selected_date,
        date_is_locked,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('trip creation error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const updateTripDate = async (trip_id, selected_date, jwtToken) => {
  return axios
    .patch(
      `${BASE_URL}/trips/update`,
      {
        trip_id,
        selected_date,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('updateTripDate error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const updateTripAccomodation = async (
  trip_id,
  selected_accomodation,
  jwtToken,
) => {
  return axios
    .patch(
      `${BASE_URL}/trips/update`,
      {
        trip_id,
        selected_accomodation,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('updateTripAccomodation error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getUserTrips = async (jwtToken) => {
  return axios
    .get(`${BASE_URL}/trips/`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getUserTrips error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getInvitedTrips = async (jwtToken) => {
  return axios
    .get(`${BASE_URL}/trips/get_invites`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getInvitedTrips error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getAcceptedTrips = async (jwtToken) => {
  return axios
    .get(`${BASE_URL}/trips/accepted_invites`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getAcceptedTrips error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getTripAttendees = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/attendees`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getTripAttendees error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const sendTripInvite = async (username, trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/invite`,
      { username, trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('sendTripInvite error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getAccomodationVotes = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/top_voted_accomodation`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getAccomodationVotes error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getTopVotedDate = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/top_selected_date`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getTopVotedDate error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const voteForActivity = async (trip_id, activity_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/vote_activity`,
      { trip_id, activity_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('voteForActivity error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const voteForAccomodation = async (
  trip_id,
  accommodation_id,
  reason,
  jwtToken,
) => {
  return axios
    .post(
      `${BASE_URL}/trips/vote_accommodation`,
      { trip_id, accommodation_id, reason },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('voteForAccomodation error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getTripRegister = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/details`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getTripRegister error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const acceptInvite = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/accept_invite`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('acceptInvite error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const denyInvite = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/deny_invite`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('denyInvite error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const completeInvite = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/complete_invite`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('completeInvite error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const inviteeUpdatePreferredDate = async (
  trip_id,
  selected_available_startdate,
  selected_available_enddate,
  selected_date_reason,
  jwtToken,
) => {
  return axios
    .patch(
      `${BASE_URL}/trips/invitee_update_trip`,
      {
        trip_id,
        selected_available_startdate,
        selected_available_enddate,
        selected_date_reason,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('inviteeUpdatePreferredDate error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const inviteeUpdatePreferredAccomodation = async (
  trip_id,
  selected_accomodation_id,
  selected_accomodation_reason,
  jwtToken,
) => {
  return axios
    .patch(
      `${BASE_URL}/trips/invitee_update_trip`,
      { trip_id, selected_accomodation_id, selected_accomodation_reason },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(
        'inviteeUpdatePreferredAccomodation error =>',
        error?.response,
      );
      return {
        success: false,
        error: error,
      };
    });
};

const getTripProposedDates = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/proposed_dates`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getTripProposedDates error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const addTripActivity = async (trip_id, activity, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/add_activities`,
      { trip_id, activity },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('addTripActivity error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getTripActivities = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/get_activities`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getTripActivities error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const addTripAccommodation = async (trip_id, accommodation, link, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/add_accommodation`,
      { trip_id, accommodation, link },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('addTripAccommodation error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getTripAccommodations = async (trip_id, jwtToken) => {
  return axios
    .post(
      `${BASE_URL}/trips/get_accommodations`,
      { trip_id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getTripAccommodations error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

export const tripService = {
  createTrip,
  getUserTrips,
  getInvitedTrips,
  getAcceptedTrips,
  getTripAttendees,
  sendTripInvite,
  getAccomodationVotes,
  getTripRegister,
  acceptInvite,
  denyInvite,
  completeInvite,
  inviteeUpdatePreferredDate,
  inviteeUpdatePreferredAccomodation,
  updateTripDate,
  updateTripAccomodation,
  getTopVotedDate,
  getTripProposedDates,
  addTripActivity,
  getTripActivities,
  addTripAccommodation,
  getTripAccommodations,
  voteForActivity,
  voteForAccomodation,
};
