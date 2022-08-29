export interface IAvatarProps {
  /** 头像形状 */
  shape?: 'circle' | 'square';
  /** 头像大小 xxs(20px)、xs(24px)、s(32px)、m(40px)、l(64px)、xl(80px) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  /** 需要展示的图片地址 */
  src?: React.ReactNode;
  /** 需要展示的图标 */
  icon?: React.ReactNode;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 元素类名 */
  className?: string;
  /** img 标签的 alt 属性，用于在图像无法显示或者用户禁用图像显示时,代替图像显示在浏览器中的内容。*/
  alt?: string;

}