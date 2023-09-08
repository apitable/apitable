/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import Image from 'next/image';
import { FC } from 'react';
import { Button } from '@apitable/components';
import { AutoTestID, Navigation, Strings, t } from '@apitable/core';
import { Wrapper } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import LinkfailureImage from 'static/icon/common/common_img_invite_linkfailure.png';
import styles from './style.module.less';

interface IUrlInvalid {
  reason: string;
}

export const UrlInvalid: FC<React.PropsWithChildren<IUrlInvalid>> = ({ reason }) => {
  const returnHome = () => {
    Router.push(Navigation.HOME);
  };

  if (!reason) return null;
  return (
    <Wrapper>
      <div id={AutoTestID.INVITE_INVALID} className={classNames(styles.urlInvalid, 'invite-children-center')}>
        <Image src={LinkfailureImage} alt={t(Strings.link_failure)} style={{ width: '240px', marginBottom: '24px' }} />
        <h1 style={{ fontSize: '16px', marginBottom: '40px' }}>{reason}</h1>
        <Button style={{ width: '240px' }} color="primary" onClick={returnHome}>
          {t(Strings.back_to_space)}
        </Button>
      </div>
    </Wrapper>
  );
};
