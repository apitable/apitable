export type IMessageType = 'default' | 'error' | 'warning' | 'success';
export interface IMessageUIProps {
  /* 提示类型，绑定颜色和 icon */
  type: IMessageType;
  /* 提示内容 */
  content: string;
  /* 设置为null时不显示图标 */
  icon?: React.ReactNode | null;
  /* 自动关闭的延时，单位秒。设为 0 时不自动关闭 */
  duration?: number;
  /* 当前提示的唯一标志 */
  messageKey?: React.Key;
  onDestroy?: ()=> void;
  motionClassName?: string;
}
// // TODO:增加promise功能
// export interface IMessageType extends PromiseLike<any> {
//   (): void;
// }

