import { FC } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { Tooltip, Avatar, IAvatarProps } from 'pc/components/common';
import classNames from 'classnames';
interface IInfoCardProps {
  title: string | JSX.Element;
  token?: React.ReactNode; // 用户标志（比如管理员）
  description?: string;
  onClick?: () => void; // 卡片是否有点击事件
  originTitle?: string; // 用于搜索状态下展示
  inSearch?: boolean; // 搜索状态下，会使用dangerouslySetInnerHTML，文字内容移出不会气泡显示
  className?: string;
  style?: React.CSSProperties;
  avatarProps: IAvatarProps;
  // 一些其他信息，展示在描述下面
  extra?: string;
}
// const searchTag = '<span class="highLight">';
export const InfoCard: FC<IInfoCardProps> = props => {
  const { 
    title, originTitle = '', description, onClick, extra,
    inSearch = false, className, avatarProps, token, ...rest 
  } = props;

  return (
    <div
      className={classNames(styles.infoCard, className)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      {...rest}
    >
      <div className={styles.defaultContent}>
        <Avatar
          {...avatarProps}
        />
        <div className={styles.text}>
          {
            inSearch && typeof title === 'string' ?
              <div className={styles.title} dangerouslySetInnerHTML={{ __html: originTitle }} /> :
              <div className={styles.name}>
                <Tooltip title={title} textEllipsis>
                  <div className={classNames(styles.title, 'title')}>
                    {title}
                  </div>
                </Tooltip>
                <div className={styles.token}>
                  {token}
                </div>
              </div>
          }
          {description && inSearch &&
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
          }
          {
            description && !inSearch &&
            <Tooltip title={description} textEllipsis>
              <div className={styles.description}>{description}</div>
            </Tooltip>
          }
          {
            extra && <div className={styles.description}>{extra || ''}</div>
          }
        </div>
      </div>
      {props.children}
    </div>
  );
};
