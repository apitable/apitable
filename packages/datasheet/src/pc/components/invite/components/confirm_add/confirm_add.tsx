import { Button } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { Wrapper } from 'pc/components/common';
import { FC } from 'react';
import InviteImage from 'static/icon/common/common_img_invite.png';
import { InviteTitle } from '../invite_title';
import styles from './style.module.less';

interface IConfirmAddProps {
  confirmBtn: () => void;
  inviter: string;
  spaceName: string;
  loading?: boolean;
}
export const ConfirmAdd: FC<IConfirmAddProps> = ({ confirmBtn, inviter, spaceName, loading = false }) => {
  return (
    <Wrapper>
      <div className={styles.confirmAdd}>
        <Image src={InviteImage} alt={t(Strings.link_failure)} style={{ width: '240px', marginBottom: '24px' }} />
        <InviteTitle inviter={inviter} spaceName={spaceName} titleMarginBottom="40px"/>
        <Button
          onClick={confirmBtn}
          color="primary"
          size="large"
          style={{ width: '220px' }}
          loading={loading}
        >
          {t(Strings.confirm_join)}
        </Button>
      </div>
    </Wrapper>
  );
};
