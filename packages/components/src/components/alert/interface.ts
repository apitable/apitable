import { IHtmlElementBase } from 'interface';

export interface IAlertProps extends IHtmlElementBase {
  /**
   * Prompt type, associated with color and icon
   */
  type: 'default' | 'error' | 'warning' | 'success'
  /**
   * title of the alert
   */
  title?: string;
  /**
   * content of the alert
   */
  content: string;
  /**
   * whether the alert should close
   */
  closable?: boolean;
  /**
   * close action callback function
   */
  onClose?: () => void;
}

export type IAlertWrapper = Pick<IAlertProps, 'title' | 'type'>;
