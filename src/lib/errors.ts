// Handle requests errors

import { humanizeString, isJSONResponse } from "./utils";

const unknownErrorMessage = (msg?: string) => {
  // eslint-disable-next-line no-param-reassign
  msg ||= "An unexpected error occured. Please try again later";
  return { type: "server", message: msg, name: "server" };
};

const humanizeErrors = (errors: Record<string, string[]>) => {
  const res: any[] = [];

  Object.keys(errors).forEach((key) => {
    res.push(
      ...errors[key].map((errorMsg) => ({
        message: humanizeString(`${key} ${errorMsg}`),
        name: key,
        type: "server",
      }))
    );
  });
  alert(JSON.stringify({ errors, res }));
  return res;
};

const getAPIErrorMessages = async (error: APIError) => {
  const res = error.response;

  const isServerError = res.status >= 500 && res.status <= 599;
  if (isServerError) {
    const message = "Server is unavailable. Please try again later.";
    return [unknownErrorMessage(message)];
  }

  if (!isJSONResponse(res)) {
    const message = await res.text();
    return [unknownErrorMessage(message)];
  }
  const data = await res.json();
  if (data.errors) return humanizeErrors(data.errors);

  return [unknownErrorMessage(data.error || undefined)];
};

export class APIError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export const getErrorMessages = async (error: Error) => {
  if (error instanceof APIError) {
    return getAPIErrorMessages(error);
  }

  return [unknownErrorMessage(error.message)];
};
