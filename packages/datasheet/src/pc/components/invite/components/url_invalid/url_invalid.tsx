import { Button } from '@vikadata/components';
import { AutoTestID, Navigation, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import Image from 'next/image';
import { Wrapper } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { FC } from 'react';
import LinkfailureImage from 'static/icon/common/common_img_invite_linkfailure.png';
import styles from './style.module.less';

interface IUrlInvalid {
  reason: string;
}

export const UrlInvalid: FC<IUrlInvalid> = ({ reason }) => {
  const returnHome = () => {
    Router.push(Navigation.HOME);
  };

  if (!reason) return null;
  return (
    <Wrapper>
      <div id={AutoTestID.INVITE_INVALID} className={classNames(styles.urlInvalid, 'invite-children-center')}>
        <Image src={LinkfailureImage} alt={t(Strings.link_failure)} style={{ width: '240px', marginBottom: '24px' }} />
        <h1 style={{ fontSize: '16px', marginBottom: '40px' }}>
          {reason}
        </h1>
        <Button style={{ width: '240px' }} color='primary' onClick={returnHome}>{t(Strings.back_to_space)}</Button>
      </div>
    </Wrapper>
  );
};
