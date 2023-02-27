export enum MessageType {
  /**
   * Sending messages in the main thread.
   * Add MAIN for easy identification.
  */
  MAIN_CONNECT_WIDGET = 'MAIN_CONNECT_WIDGET',
  MAIN_INIT_WIDGET_DATA = 'MAIN_INIT_WIDGET_DATA',
  MAIN_SYNC_WIDGET_CONFIG = 'MAIN_SYNC_WIDGET_CONFIG',
  MAIN_REFRESH_WIDGET = 'MAIN_REFRESH_WIDGET',
  MAIN_SYNC_COMMAND_RESULT = 'MAIN_SYNC_COMMAND_RESULT',
  MAIN_SYNC_ACTION = 'MAIN_SYNC_ACTION',
  MAIN_SYNC_RECORD_PICKER_RESULT = 'MAIN_SYNC_RECORD_PICKER_RESULT',
  /**
   * Sending messages in the widget.
   * Add WIDGET for easy identification.
   */
  WIDGET_CONNECT = 'WIDGET_CONNECT',
  WIDGET_CONNECT_ES = 'WIDGET_CONNECT_ES',
  WIDGET_SYNC_COMMAND = 'WIDGET_SYNC_COMMAND',
  WIDGET_EXPAND_RECORD = 'WIDGET_EXPAND_RECORD',
  WIDGET_EXPAND_RECORD_PICKER = 'WIDGET_EXPAND_RECORD_PICKER',
  WIDGET_MOUSE_EVENT = 'WIDGET_MOUSE_EVENT',
  WIDGET_SYNC_WIDGET_CONFIG = 'WIDGET_SYNC_WIDGET_CONFIG',
  WIDGET_EXPAND_DEV_CONFIG = 'WIDGET_EXPAND_DEV_CONFIG',
  WIDGET_FETCH_VIEW = 'WIDGET_FETCH_VIEW',
  WIDGET_FETCH_DATASHEET = 'WIDGET_FETCH_DATASHEET',
  WIDGET_SUBSCRIBE_CHANGE = 'WIDGET_SUBSCRIBE_CHANGE',
}

export interface IMessage {
  type: MessageType;
  response: IResponse;
  messageId?: string;
}

export interface IResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  origin?: string;
}

/**
 * iframe send window
 */
export interface IContentWindow {
  window: Window;
  origin: string;
}

export enum MouseListenerType {
  ENTER = 'mouseenter',
  LEAVE = 'mouseleave'
}

export enum ConnectStatus {
  // No connection established.
  CLOSED,
  // Connection is established, but no data can be sent or received.
  SYN_SENT,
  // The ability to send and receive data has been confirmed.
  ESTABLISHED
}
