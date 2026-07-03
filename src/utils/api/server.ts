import { Poll, Vote, HttpResponse, Time } from "../../models/poll";

const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "";
  }

  return NEXT_PUBLIC_BASE_URL;
};

const httpMethod = async (
  endpoint: string,
  requestOptions: RequestInit
): Promise<HttpResponse> => {
  const res = await fetch(endpoint, requestOptions);
  const { status } = res;
  const responseData = await res.json();
  return {
    data: responseData,
    statusCode: status,
  };
};

const getHttpResponseErrorMessage = (
  response: HttpResponse,
  fallbackMessage: string
): string => {
  const message = response?.data?.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallbackMessage;
};

const getPoll = (
  pollID: string | string[] | null | undefined
): Promise<HttpResponse> => {
  const endpoint = `${getApiBaseUrl()}/api/poll/${pollID}`;
  const requestOptions: RequestInit = {
    method: "GET",
  };
  return httpMethod(endpoint, requestOptions);
};

const createPoll = (pollArgs: { poll: Poll }): Promise<HttpResponse> => {
  const { poll } = pollArgs;
  const endpoint = `${getApiBaseUrl()}/api/poll/create`;
  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  console.info("Poll creation request started", {
    requestId,
    endpoint,
    timesCount: poll.times?.length || 0,
    pollType: poll.type,
    titleLength: poll.title?.length || 0,
    hasSecret: Boolean(poll.secret),
    plainSecretLength: poll.secret?.length || 0,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "x-slotline-request-id": requestId,
    },
    body: JSON.stringify(poll),
  };
  return httpMethod(endpoint, requestOptions).then((response) => {
    console.info("Poll creation response received", {
      requestId,
      statusCode: response.statusCode,
      message: response.data?.message,
      pollId: response.data?._id,
    });

    return response;
  });
};

const markTimes = (voteArgs: {
  newVote: Vote;
  pollID: string;
}): Promise<HttpResponse> => {
  const { newVote, pollID } = voteArgs;
  const endpoint = `${getApiBaseUrl()}/api/poll/${pollID}`;
  const requestOptions: RequestInit = {
    method: "PUT",
    body: JSON.stringify(newVote),
  };
  return httpMethod(endpoint, requestOptions);
};

const markFinalTime = (voteArgs: {
  finalTime: { finalTime: Time | undefined; open: boolean };
  pollID: string;
  secret: string;
}): Promise<HttpResponse> => {
  const { finalTime, pollID, secret } = voteArgs;
  const endpoint = `${getApiBaseUrl()}/api/poll/${pollID}/${secret}`;
  const requestOptions: RequestInit = {
    method: "PUT",
    credentials: "same-origin",
    body: JSON.stringify(finalTime),
  };
  return httpMethod(endpoint, requestOptions);
};

const deletePoll = (deleteArgs: {
  pollID: string;
  secret: string;
}): Promise<HttpResponse> => {
  const { pollID, secret } = deleteArgs;
  const endpoint = `${getApiBaseUrl()}/api/poll/${pollID}/${secret}`;
  const requestOptions: RequestInit = {
    method: "DELETE",
    credentials: "same-origin",
  };
  return httpMethod(endpoint, requestOptions);
};

export {
  getPoll,
  createPoll,
  markTimes,
  markFinalTime,
  deletePoll,
  getHttpResponseErrorMessage,
};
