export const saveSession = token => {
  sessionStorage.setItem('token', token);
};

export const getSession = () => {
  return sessionStorage.getItem('token');
};