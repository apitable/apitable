import { AIModal, AIType, TrainStatus } from './enum';
import { IField } from '../../../../types';

type ITimestamp = string;

export interface IAiInfoSetting {
  // A chat message when a chat without response
  idk: string;
  // All conversations with this bot will start with your prompt but it will not be visible to the user in the chat.
  // If you would like the prompt message to be visible to the user, consider using an intro message instead.
  promptStartingBefore: string;
  // A chat message when a new context (or new chat) begins
  prologue: string;
  model: AIModal;
  // show explore card or not
  hasRecommendedHint: boolean;
  hasSuggestionTips: boolean;
  type: AIType;
}

export interface IAiSourceDatasheet {
  id: string;
  name: string;
  meta: {
    viewId: string;
    rows:number;
    fields: IField[]
  }
}

export interface IAIInfoResponse extends IAiInfoSetting {
  id: string;
  name: string;
  picture: string;
  description: string;

  livemode: boolean;
  latestTrainingStatus: TrainStatus;
  completed: string;
  createdAt: ITimestamp;
  model: AIModal;
  node: {},
  datasheet: IAiSourceDatasheet[]
}

export interface IUpdateAIInfoParams extends IAiInfoSetting {
  datasheet: {
    id: string;
    viewId: string;
  }[]
}

export interface ISendChatMessageParams {
  conversationId: string;
  content: string,
}

export interface IChatMessageResponse {
  'id': string;
  'aiId': string;
  'conversationId': string;
  'content': string;
  'contextType': string;
  'status': string;
  'author': string;
  'created': number;
  'suggestedReplies': string[]
}

export interface IAIApiResponse<T extends {} = {}> {
  success: boolean;
  message: string;
  code: number;
  data: T;
}

export interface IGetAIInfoResponse extends IAIApiResponse {
  data: {
    ai: string;
    conversation: string;
    suggestions: string[]
  }
}

export type IChatMessageListResponse = {
  data: IChatMessageResponse[];
  hasMore: boolean;
};
