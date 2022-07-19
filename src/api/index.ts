export const BASE_URL = "http://localhost:3001/api/v1";

export const defaultHeaders = () => {
  let user = window.localStorage.get("user");
  user = user ? JSON.parse(user) : {};

  return {
    "Content-Type": "application/json",
    ...(user.token && { Authorization: `Bearer ${user.token}` }),
  };
};
