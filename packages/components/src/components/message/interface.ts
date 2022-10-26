export type IMessageType = 'default' | 'error' | 'warning' | 'success';
export interface IMessageUIProps {
  /** 
   * Message type
   */
  type: IMessageType;
  /**
   * Message content
   */
  content: string;
  /**
   * Message icon
  */
  icon?: React.ReactNode | null;
  /** 
   * Delay of automatic closing, in seconds. Do not close automatically when set to 0
   */
  duration?: number;
  /**
   * Message primary key
   */
  messageKey?: React.Key;
  onDestroy?: ()=> void;
  motionClassName?: string;
}

