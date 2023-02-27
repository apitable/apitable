import { IWidgetConfigIframe, IWidgetState } from 'interface';

// export interface IConnectResponse {
//   widgetId: string;
//   origin: string;
// }

export type IInitData = IWidgetState & {
  widgetConfig: IWidgetConfigIframe
};

export interface ISubscribeView {
  datasheetId: string;
  viewId: string;
}

export interface IFetchDatasheet {
  datasheetId: string;
  overWrite?: boolean;
}
