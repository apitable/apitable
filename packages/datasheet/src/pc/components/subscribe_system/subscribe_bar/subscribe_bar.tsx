import { Avatar, LinkButton, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Logo } from 'pc/components/common';
import { showOrderContactUs } from 'pc/components/subscribe_system/order_modal/pay_order_success';
import styles from 'pc/components/subscribe_system/styles.module.less';
import { useSelector } from 'react-redux';

export const SubscribeBar = (props) => {
  const colors = useThemeColors();
  const userInfo = useSelector(state => state.user.info);

  return <div className={styles.navBar}>
    <div style={{ margin: '0 auto', width: 976 }} className={styles.navBarInner}>
      <div className={styles.logo} onClick={() => location.href = '/workbench'}>
        {/* The color values here are fixed according to the requirements of the design, regardless of theme switching */}
        <Logo size="small" />
      </div>
      <div style={{ flex: 1 }} />
      <Typography variant={'body2'} style={{ marginRight: 32 }}>
        <LinkButton underline={false} onClick={showOrderContactUs} color={colors.fc1}>
          {t(Strings.contact_us)}
        </LinkButton>
      </Typography>
      <Avatar src={userInfo?.avatar || undefined} size={'xs'}>
        {userInfo?.nickName[0]}
      </Avatar>
      <Typography variant={'body2'} style={{ marginLeft: 8 }}>
        {userInfo?.memberName}
      </Typography>
    </div>
  </div>;
};
