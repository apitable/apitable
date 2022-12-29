import { FC } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { t, Strings } from '@apitable/core';

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

export const InviteTitle: FC<IInviteTitleProps> = props => {
  const { inviter, spaceName, titleMarginBottom = '24px', subTitleMarginBottom = '30px', invitee, desc, ...rest } = props;
  return (
    <div className={styles.inviteTitle} {...rest}>
      <h1 style={{ marginBottom: titleMarginBottom }}>{inviter}
        {t(Strings.invite_your_join)}
        <span className={styles.highLightText}>「{spaceName}」</span>
      </h1>
      {invitee && !desc &&
        <h2 style={{ marginBottom: subTitleMarginBottom }}>
          {t(Strings.invite_invite_title_desc, { invitee })}
        </h2>
      }
      {desc && <h2 style={{ marginBottom: subTitleMarginBottom }}>{desc}</h2>}
    </div>
  );
};
