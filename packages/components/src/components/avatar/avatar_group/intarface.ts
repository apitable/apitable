export interface IAvatarGroup {
  /**
   * maximum number of avatars displayed
   */
  max?: number;
  /** avatar size xxs(20px)、xs(24px)、s(32px)、m(40px)、l(64px)、xl(80px) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  /**
   * avatar inline style
   */
  maxStyle?: React.CSSProperties;
}