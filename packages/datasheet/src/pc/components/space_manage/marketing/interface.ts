export interface IStoreAppInstance {
  appId: string;
  appInstanceId: string; // The id of the application instantiated after it has been opened
  config: {
    type: AppType;
    profile: {
      [propsname: string]: any;
    }
  };
  createdAt: string;
  isEnabled: boolean; // Three states exist on the backend, on/deactivate/delete
  spaceId: string;
  type: AppType;
}

export interface IStoreApp {
  appId: string;
  name: string;
  type: AppType;
  appType: string;
  status: string;
  intro: string;
  helpUrl: string;
  description: string;
  displayImages: string[];
  notice: string;
  logoUrl: string;
  needConfigured: boolean;
  configureUrl: string;
  needAuthorize: boolean;
  instance?: IStoreAppInstance;
  stopActionUrl?: string;
}

export enum AppType {
  Lark = 'LARK',
  LarkStore = 'LARK_STORE',
  DingTalk = 'DINGTALK',
  DingtalkStore = 'DINGTALK_STORE',
  Wecom = 'WECOM',
  WecomStore = 'WECOM_STORE',
  OfficePreview = 'OFFICE_PREVIEW',
}

export enum AppStatus {
  Open = 'open',
  Close = 'close',
}
