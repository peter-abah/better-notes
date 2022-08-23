import { APIError } from "../lib/errors";
import { isJSONResponse } from "../lib/utils";

export const BASE_URL = "http://localhost:3001/api/v1";

export const defaultHeaders = () => {
  const userData = window.localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : {};

  return {
    "Content-Type": "application/json",
    ...(user.token && { Authorization: `Bearer ${user.token}` }),
  };
};

// Adds auth header, content type type and base url before fetching resource
// e.g customFetch("/notes").
// Also throws error for 400 and 500 status codes
export const customFetch = async (
  resource: string,
  options?: Parameters<typeof fetch>[1]
) => {
  const url = `${BASE_URL}${resource}`;
  const defaultOptions: any = {
    mode: "cors",
  };
  defaultOptions.headers =
    options?.headers instanceof Headers
      ? options.headers
      : new Headers({ ...defaultHeaders(), ...options?.headers });

  const res = await fetch(url, { ...options, ...defaultOptions });
  if (!res.ok) {
    throw new APIError("Request error", res);
  }

  if (isJSONResponse(res)) {
    return res.json();
  }
  return res.text();
};
