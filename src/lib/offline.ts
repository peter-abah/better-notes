/* Handle requests
 * If they are offline store them in a queue and retry later
 * If there is a server error calls the callback and clear the queue
 * Else calls the sucess callback with the data
 * Stores the requests queue in local storage and loads it when the app starts
 */

import { customFetch } from "../api";

// Make headers to be only object rather a Headers object so
// it can be easily serialized
type CustomOptions = Parameters<typeof fetch>[1] & {
  headers: Record<string, string>;
  body: string;
};

interface CustomReq {
  resource: string;
  options: CustomOptions;
}

class RequestsQueue {
  requests: CustomReq[];

  retries: number;

  timeToRetry: number;

  timeoutId: number | null;

  // Loads requests queue from storage
  static loadData() {
    const queueData = window.localStorage.getItem("requests-queue");
    if (queueData) {
      return JSON.parse(queueData);
    }
    const data = { requests: [] };
    localStorage.setItem("requests-queue", JSON.stringify(data));
    return data;
  }

  constructor() {
    this.requests = RequestsQueue.loadData().requests;
    this.retries = 0;
    this.timeToRetry = 100;
    this.timeoutId = null;

    // Tries to send saved requests
    this.sendRequests();
  }

  addRequest(req: CustomReq) {
    this.requests.push(req);

    this.retries = 0;
    if (this.timeoutId) window.clearTimeout(this.timeoutId);
    this.timeoutId = null;

    this.sendRequests();
    this.serialize();
  }

  serialize() {
    window.localStorage.setItem(
      "requests-queue",
      JSON.stringify({ requests: this.requests })
    );
  }

  // Tries to send requests in queue
  // If unsucessful retry later using exponential backoff
  async sendRequests() {
    while (this.requests.length > 0) {
      if (!window.navigator.onLine) {
        this.retryRequests();
        return;
      }

      try {
        const req = this.requests[0];

        // The requests have to be synchronous
        // eslint-disable-next-line no-await-in-loop
        await customFetch(req.resource, req.options);
        // TODO: Add notifying app of sucessful request
        this.requests.shift();
      } catch (e) {
        // TODO: some errors need the request to be cancelled
        this.retryRequests();
        return;
      }

      this.serialize();
    }
  }

  retryRequests() {
    this.retries += 1;
    if (this.timeoutId) window.clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(
      () => this.sendRequests,
      this.timeToRetry ** this.retries
    );
  }
}

const requestsQueue = new RequestsQueue();

export function sendRequest(resource: string, options: CustomOptions) {
  requestsQueue.addRequest({ resource, options });
}

export const getRequests = () => requestsQueue.requests;
