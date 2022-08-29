export interface IAvatarGroup {
  /**
   * 显示的最大头像个数
   */
  max?: number;
  /** 头像大小 xxs(20px)、xs(24px)、s(32px)、m(40px)、l(64px)、xl(80px) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  /**
   * 多余头像样式
   */
  maxStyle?: React.CSSProperties;
}