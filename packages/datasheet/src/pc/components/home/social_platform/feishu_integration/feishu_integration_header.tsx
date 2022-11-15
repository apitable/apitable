import { IUserInfo, Settings, Strings, t } from '@apitable/core';
import { AvatarSize, Avatar, Logo } from 'pc/components/common';
import * as React from 'react';
import styles from './styles.module.less';
import { Space, ThemeName } from '@apitable/components';

export const FeishuIntegrationHeader: React.FC<{userInfo: IUserInfo}> = (props) => {
  const { userInfo: user } = props;
  const renderAvatar = (style?: React.CSSProperties) => {
    if (!user) {
      return;
    }
    return (
      <Space>
        <Avatar
          id={user.memberId}
          src={user.avatar}
          title={user.nickName}
          size={AvatarSize.Size24}
          className={styles.avatorImg}
          style={style}
        />
        <div>{user.nickName}</div>
      </Space>
    );
  };

  return (
    <div className={styles.wecomIntegrationHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <Logo className={styles.logo} theme={ThemeName.Light} />
          <div className={styles.desc}>{t(Strings.lark_integration)}</div>
        </div>
        <div className={styles.headerRight}>
          <a
            target="_blank"
            className={styles.helpItem}
            href={Settings.integration_wecom_bind_help_center.value} rel="noreferrer"
          >{t(Strings.help_center)}</a>
          {renderAvatar()}
        </div>
      </div>
    </div>
  );
};
