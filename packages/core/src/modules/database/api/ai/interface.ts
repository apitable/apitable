import { AIModal, AIType, TrainStatus } from './enum';
import { IField } from '../../../../types';
import { NodeType } from '../../../../config/constant';

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
  nodeId: string;
  nodeName: string;
  nodeType: NodeType
  setting: {
    viewId: string;
    rows: number;
    fields: IField[]
  }
}

export interface IAIInfoResponse extends IAiInfoSetting {
  id: string;
  name: string;
  picture: string;
  description: string;
  currentConversationId: string;
  livemode: boolean;
  latestTrainingStatus: TrainStatus;
  completed: string;
  createdAt: ITimestamp;
  model: AIModal;
  node: {},
  dataSources: IAiSourceDatasheet[]
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
  type: string;
  data: {
    additional_kwargs: {};
    content: string;
    example: boolean
  }
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

export interface IGetAITrainingStatusResponse extends IAIApiResponse {
  data: {
    status: TrainStatus
  }
}

export type IChatMessageListResponse = {
  data: IChatMessageResponse[];
  hasMore: boolean;
};
