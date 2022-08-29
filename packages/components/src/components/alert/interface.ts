import { IHtmlElementBase } from 'interface';

export interface IAlertProps extends IHtmlElementBase {
  /**
   * 提示类型，绑定颜色和 icon
   */
  type: 'default' | 'error' | 'warning' | 'success'
  /**
   * 提示标题
   */
  title?: string;
  /**
   * 提示内容
   */
  content: string;
  /**
   * 是否可关闭
   */
  closable?: boolean;
  /**
   * 关闭提示时的回掉函数
   */
  onClose?: () => void;
}

export type IAlertWrapper = Pick<IAlertProps, 'title' | 'type'>;
