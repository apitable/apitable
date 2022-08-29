export interface IApp {
  appId: string;
  status: boolean;
  type?: string;
  appType?: string;
}

interface IImage {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  token: string;
  width: number;
  height: number;
  url: string;
}
export interface IAppInfo {
  logo: IImage;
  app_info: string;
  note: string;
  app_name: string;
  type: string;
  // TODO: 待删除，由modal.app_description代替
  // app_description: string;
  id: string;
  image: IImage;
  app_id: string;
  btn_card: {
    btn_text: string;
    btn_action?: string;
    btn_close_action?: string;
    btn_type: string;
    // TODO: 待删除，由modal.btn_text代替
    // apps_btn_text: string;
  };

  modal: {
    btn_type: string;
    app_description: string;
    btn_text: string;
    btn_action?: string;
    help_link: string;
  },
  // link_to_cms: string;
}

export interface IStoreAppInstance {
  appId: string;
  appInstanceId: string; // 已经开启后的应用实例化的 id
  config: {
    type: AppType;
    profile: {
      [propsname: string]: any;
    }
  };
  createdAt: string;
  isEnabled: boolean; // 后端存在三个状态，开启/停用/删除
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
