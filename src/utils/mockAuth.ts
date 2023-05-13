import { UserData } from 'src/store/reducers/user';

export function mockAuthLogout() {
  if (typeof window === 'object') {
    document.cookie = 'mockAuth=hi; path=/; max-age=0';
  }
}

export function mockAuthLogin() {
  const user: UserData = {
    id: 0,
    email: 'mock@gmail.com',
    password: '123',
    role: 1,
    username: '관리자',
    phone: '01012345678',
    address: '',
    addressDetail: '',
    createdAt: '',
  };
  if (typeof window === 'object') {
    document.cookie = 'mockAuth=hi; path=/';
  }
  return Promise.resolve(user);
}
