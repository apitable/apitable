import axios from 'axios';
import urlcat from 'urlcat';
import * as Url from '../url.data';
import {
  IAIApiResponse,
  IAIInfoResponse,
  IChatMessageListResponse,
  IGetAIInfoResponse,
  IGetAITrainingStatusResponse,
  IUpdateAIInfoParams,
} from './interface';

const baseURL = process.env.NEXT_PUBLIC_NEXT_API;

export const getAiInfo = (aiId: string) => {
  return axios.get<IAIApiResponse<{ ai: IAIInfoResponse }>>(urlcat(Url.GET_AI_INFO, { aiId }), {
    baseURL,
  });
};

export const getChatHistoryList = (aiId: string, search?: {
  cursor?: string,
  limit?: number,
  conversationId?: string
}) => {
  return axios.get<IAIApiResponse<IChatMessageListResponse>>(urlcat(Url.GET_MESSAGE_LIST, { aiId }), {
    baseURL,
    params: search,
  });
};

export const updateAIInfo = (info: Partial<IUpdateAIInfoParams>, aiId: string) => {
  return axios.put<IAIApiResponse>(urlcat(Url.GET_AI_INFO, { aiId }), info, {
    baseURL,
  });
};

// export const sendChatMessage = (message: ISendChatMessageParams, aiId: string) => {
//   return axios.post<IAIApiResponse<IChatMessageResponse>>(urlcat(Url.SEND_CHAT_MESSAGE, { aiId }), message, {
//     baseURL,
//   });
// };

export const breakChatMessage = (aiId: string) => {
  return axios.post<IAIApiResponse>(urlcat(Url.BREAK_CHAT_MESSAGE, { aiId }), null, {
    baseURL,
  });
};

export const getConversationSuggestion = (aiId: string) => {
  return axios.get<IGetAIInfoResponse>(urlcat(Url.GET_CONVERSATION_SUGGESTION, { aiId }), {
    baseURL,
  });
};

export const getAITrainingStatus = (aiId: string) => {
  return axios.get<IGetAITrainingStatusResponse>(urlcat(Url.GET_AI_TRAINING_STATUS, { aiId }), {
    baseURL,
  });
};
