import axios from 'axios';
import store from '@/store';

function unsetToken() {
  axiosInstance.defaults.headers = {};
  store.token = null;
  store.profile = null;
}

export let axiosInstance = axios.create({
  baseURL: '/api/',
});

axiosInstance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response) {
      error = error.response.data;
      if (error.error === 'TokenExpiredError') unsetToken();
      else alert(JSON.stringify(error, null, 2));
    }
    return Promise.reject(error);
  },
);

/**
 * @returns token
 */
export async function register(email: string, username: string, password: string): Promise<string> {
  store.token = (await axiosInstance.post('register', {
    email,
    username,
    password,
  })).data;
  return store.token!;
}

/**
 * @returns token
 */
export async function login(email: string, password: string): Promise<string> {
  store.token = (await axiosInstance.post('login', { email, password })).data;
  return store.token!;
}

export async function logout() {
  await axiosInstance.post('logout');
}

/**
 * @returns voted?
 */
export async function vote(threadId: string, vote: -1 | 1): Promise<boolean> {
  return (await axiosInstance.post('vote', { threadId, vote })).data;
}

export async function editProfile(username?: string, email?: string): Promise<void> {
  await axiosInstance.post('editProfile', { username, email });
  if (username) store.profile!.username = username;
  if (email) store.profile!.email = email;
}

export async function editPassword(oldPassword: string, newPassword: string): Promise<void> {
  await axiosInstance.post('editPassword', { oldPassword, newPassword });
}

export async function newThread(title: string): Promise<IThread> {
  return (await axiosInstance.post('newThread', { title })).data;
}

export async function newPost(threadId: string, text?: string, file?: File): Promise<IPost> {
  const data = new FormData();
  data.append('threadId', threadId);
  if (text) data.append('text', text);
  if (file) data.append('pic', file);

  return (await axiosInstance.post('newPost', data)).data;
}

export async function getThreads(
  count: number,
  skip: number,
): Promise<{ threads: IThread[]; total: number }> {
  return (await axiosInstance.post('getThreads', {
    count,
    skip,
  })).data;
}

export async function getThread(threadId: string): Promise<IThread> {
  return (await axiosInstance.post('getThread', { threadId })).data;
}

export async function getPosts(
  threadId: string,
  count: number,
  skip: number,
): Promise<{ posts: IPost[]; total: number }> {
  return (await axiosInstance.post('getPosts', { threadId, count, skip })).data;
}

export async function getMe(): Promise<IUser> {
  return (await axiosInstance.post('getMe')).data;
}
