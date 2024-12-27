let authToken: string | null = null;
let userEmail: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const setUserEmail = (email: string | null) => {
  userEmail = email;
};

export const getUserEmail = () => userEmail;