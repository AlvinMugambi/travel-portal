import { atom } from 'recoil';

export const loading = atom({
  key: 'loading',
  default: false,
});

export const JwtTokenState = atom({
  key: 'JWT_TOKEN',
  default: '',
});

export const UserData = atom({
  key: 'user_data',
  default: {
    id: '',
    email: '',
    username: '',
    phone_number: '',
  },
});
