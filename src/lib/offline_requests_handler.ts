import { customFetch } from "../api";
import { APIError } from "./errors";

// Make headers to only be object rather a Headers object so
// it can be easily serialized
type CustomOptions = Parameters<typeof fetch>[1] & {
  headers?: Record<string, string>;
};

interface CustomRequest {
  resource: string;
  options: CustomOptions;
}

interface HandlerOptions {
  /*
   * A custom fetch function can be passed as an option
   * the return type is void since the response is not
   * checked
   * It is necessary to pass a custom fetch function at least to
   * handle 40x and 50x responses and throw errors
   * Since it is not checked in the request handler.
   */
  fetchFunc?: (url: string, options: CustomOptions) => void;

  /*
   * Decides what happens when an error happens during a request.
   * It is passed the request and the error that occured and returns either undefined or null or a request(CustomRequest).
   * If the request should be retried then the request should be returned else return null or undefined to skip the request
   * The request can also be modified and the modified request will be retried
   * By default all requests will be retried if the function is undefined
   */
  handleRequestError?: (
    err: unknown,
    request: CustomRequest
  ) => CustomRequest | null | undefined;
}

function defaultRequestErrorHandler(e: any, req: CustomRequest) {
  // Returning the req will make the request be retried by default
  return req;
}
function loadRequests() {
  const queueData = window.localStorage.getItem("requests-queue");
  if (queueData) return JSON.parse(queueData);

  const data = { requests: [] };
  localStorage.setItem("requests-queue", JSON.stringify(data));
  return data;
}

const serializeRequests = (requests: CustomRequest[]) => {
  window.localStorage.setItem("requests-queue", JSON.stringify({ requests }));
};

function initRequestsHandler(options: HandlerOptions = {}) {
  let { requests } = loadRequests();
  const timeToRetry = 100;
  let retries = 0;
  let timeoutId: number | null = null;

  const fetchFunc = options.fetchFunc || window.fetch;
  const handleRequestError =
    options.handleRequestError || defaultRequestErrorHandler;

  const retryRequests = () => {
    if (timeoutId != null) {
      window.clearTimeout(timeoutId);
    }

    // TODO: Name the constants
    const exponent = (0.2 + retries / 100) * retries + 1;
    const delay = timeToRetry ** exponent;

    // The functions call each other (mutual recursion) so one function has to be called before defined
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    timeoutId = window.setTimeout(sendRequests, delay);
    retries += 1;
  };

  const sendRequests = async () => {
    while (requests.length > 0) {
      if (!window.navigator.onLine) {
        retryRequests();
        return;
      }

      const req = requests[0];
      try {
        // The requests have to be synchronous
        // eslint-disable-next-line no-await-in-loop
        await fetchFunc(req.resource, req.options);
        // TODO: Add notifying app of sucessful request
        requests.shift();
      } catch (e) {
        const newRequest = handleRequestError(e, req);
        if (newRequest) {
          // Retry request, modifying it if modified bybthe error handler
          requests[0] = newRequest;
          retryRequests();
          return;
        }

        // Else skip request
        requests.shift();
      }

      serializeRequests(requests);
    }
  };

  const addRequest = (req: CustomRequest) => {
    requests.push(req);
    serializeRequests(requests);

    retryRequests();
  };

  const resetRequests = () => {
    requests = [];
    if (timeoutId != null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = null;
    serializeRequests(requests);
  };

  return {
    get requests() {
      return requests;
    },
    addRequest,
    retryRequests,
    reset: resetRequests,
  };
}

function requestErrorHandler(err: unknown, req: CustomRequest) {
  if (!(err instanceof APIError)) return;

  // If it is a 404 error then skip request since the resource no longer exists
  if (err.response.status === 404) return;

  // Retry request in any other case
  // eslint-disable-next-line consistent-return
  return req;
}

export const requestsHandler = initRequestsHandler({
  fetchFunc: customFetch,
  handleRequestError: requestErrorHandler,
});

export default initRequestsHandler;
