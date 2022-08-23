import { customFetch } from "../api";

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
  const fetchFunc = options.fetchFunc || window.fetch;
  const timeToRetry = 100;
  let retries = 0;
  let timeoutId: number | null = null;

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

      try {
        const req = requests[0];

        // The requests have to be synchronous
        // eslint-disable-next-line no-await-in-loop
        await fetchFunc(req.resource, req.options);
        // TODO: Add notifying app of sucessful request
        requests.shift();
      } catch (e) {
        alert(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        alert(JSON.stringify([requests[0], "Request error"]));
        retryRequests();
        // TODO: some errors need the request to be cancelled
        return;
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

export const requestsHandler = initRequestsHandler({ fetchFunc: customFetch });

export default initRequestsHandler;
