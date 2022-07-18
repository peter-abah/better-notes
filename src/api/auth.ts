import { APIError } from "../lib/errors";

const BASE_URL = "http://localhost:3001/api/v1";

export interface User {
  email: string;
  token: string;
}

const getToken = (res: Response) => {
  const authHeader = res.headers.get("Authorization");
  if (!authHeader) return "";

  return authHeader.split(" ")[1];
};

interface LoginData {
  email: string;
  password: string;
}
export const loginUser = async (loginData: LoginData) => {
  const res = await fetch(`${BASE_URL}/sign_in`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: loginData }),
  });

  if (!res.ok) {
    throw new APIError("Sign in error", res);
  }

  const data = await res.json();
  return {
    email: data.user.email,
    token: getToken(res),
  };
};

interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
}
export const registerUser = async (registerData: RegisterData) => {
  const res = await fetch(`${BASE_URL}/sign_up`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: registerData }),
  });

  if (!res.ok) {
    throw new APIError("Sign up error", res);
  }

  const data = await res.json();
  return {
    email: data.user.email,
    token: getToken(res),
  };
};
