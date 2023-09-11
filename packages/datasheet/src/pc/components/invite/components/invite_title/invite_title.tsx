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

import { FC } from 'react';
import * as React from 'react';
import { t, Strings } from '@apitable/core';
import styles from './style.module.less';

type ITitleMarginBottom = '104px' | '50px' | '24px' | '40px' | '16px';
type ISubTitleMarginBottom = '0' | '30px' | '24px';

interface IInviteTitleProps {
  inviter: string;
  spaceName: string;
  titleMarginBottom?: ITitleMarginBottom;
  subTitleMarginBottom?: ISubTitleMarginBottom;
  invitee?: string;
  style?: React.CSSProperties;
  desc?: string;
}

export const InviteTitle: FC<React.PropsWithChildren<IInviteTitleProps>> = (props) => {
  const { inviter, spaceName, titleMarginBottom = '24px', subTitleMarginBottom = '30px', invitee, desc, ...rest } = props;
  return (
    <div className={styles.inviteTitle} {...rest}>
      <h1 style={{ marginBottom: titleMarginBottom }}>
        {inviter}
        {t(Strings.invite_your_join)}
        <span className={styles.highLightText}>「{spaceName}」</span>
      </h1>
      {invitee && !desc && <h2 style={{ marginBottom: subTitleMarginBottom }}>{t(Strings.invite_invite_title_desc, { invitee })}</h2>}
      {desc && <h2 style={{ marginBottom: subTitleMarginBottom }}>{desc}</h2>}
    </div>
  );
};
