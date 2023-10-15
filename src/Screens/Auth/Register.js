import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { JwtTokenState, UserData } from '../../State/atoms/auth';
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
import jwt_decode from 'jwt-decode';

import { authService } from '../../Services/authService';
import StyledText from '../../Components/Common/StyledText';
import FormView from '../../Components/Common/FormView';
import Input from '../../Components/Common/Input';
import Button from '../../Components/Common/Button';

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export default function Register() {
  const [email, setEmailAddress] = useState('');
  const [username, setUsername] = useState('');
  //   const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setJwt_token = useSetRecoilState(JwtTokenState);
  const setUserData = useSetRecoilState(UserData);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = () => {
    if (!validateEmail(email)) {
      setError('Kindly provide a valid email address');
      return;
    }
    setLoading(true);
    authService.register(email, username, '', password).then((res) => {
      setLoading(false);
      if (res.status === 201) {
        setJwt_token(res.token);
        const decoded = jwt_decode(res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userData', JSON.stringify(decoded));
        setUserData(decoded);
        navigate('/Dashboard');
      } else {
        console.log('error===>', res.error);
        setError(
          res?.error?.response?.data?.error ||
            'Kindly check the form and try again',
        );
      }
    });
  };

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.flexCenter}>
          <img
            src={require('../../Assets/Images/travel-tech-logo.png')}
            alt=''
            style={styles.img}
          />
          <StyledText fontSize="20px" fontWeight={700}>
            Travel Tech Africa
          </StyledText>
        </div>
      </div>
      <div style={styles.form}>
        <StyledText
          fontSize="25px"
          fontWeight={700}
          customStyle={{ marginBottom: 20 }}
        >
          Welcome!
        </StyledText>
        <FormView width={420}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {error && (
              <StyledText fontSize="14px" color="red">
                {error}
              </StyledText>
            )}
          </div>
          <div style={styles.input}>
            <StyledText fontSize={16}>Email</StyledText>
            <Input
              width={410}
              placeHolder={'Enter Email'}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>
          <div style={styles.input}>
            <StyledText fontSize={16}>Username</StyledText>
            <Input
              width={410}
              placeHolder={'Enter username'}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {/* <div style={styles.input}>
            <StyledText fontSize={16}>Phone number</StyledText>
            <Input
              width={410}
              placeHolder={'e.g. 254701234567'}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div> */}
          <div style={styles.input}>
            <StyledText fontSize={16}>Password</StyledText>
            <Input
              width={410}
              type={'password'}
              placeHolder={'Enter password'}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <Button
              label={
                loading ? (
                  <InfinitySpin width="200" color="#4fa94d" />
                ) : (
                  'Submit'
                )
              }
              width={420}
              disabled={!email || !username || !password}
              onClick={onSubmit}
            />
          </div>
        </FormView>
      </div>
    </div>
  );
}

const styles = {
  flexCenter: { display: 'flex', alignItems: 'center' },
  img: {
    width: 60,
    height: 60,
    marginTop: 20,
    marginLeft: 20,
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  input: {
    marginBottom: 20,
  },
  form: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
