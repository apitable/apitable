import { Strings, t } from '@vikadata/core';
import { LinkButton, colorVars } from '@vikadata/components';

import IconNext from 'static/icon/datasheet/activity/datasheet_icon_activity_under.svg';
import IconPre from 'static/icon/datasheet/activity/datasheet_icon_activity_up.svg';

import styles from './style.module.less';

interface IPageTurnProps {
  onClickPre(): void;
  onClickNext(): void;
  disablePre: boolean;
  disableNext: boolean;
}

export const PageTurnMobile = ({
  onClickPre,
  onClickNext,
  disablePre,
  disableNext
}: IPageTurnProps): JSX.Element => (
  <div className={styles.bottomPageTurn}>
    <LinkButton
      underline={false}
      component="button"
      prefixIcon={<IconPre width={16} height={16} fill={colorVars.fc1} />}
      color={colorVars.fc1}
      disabled={!disablePre}
      className={styles.button}
      onClick={() => onClickPre()}
    >
      {t(Strings.previous_record_plain)}
    </LinkButton>
    <LinkButton
      underline={false}
      component="button"
      prefixIcon={<IconNext width={16} height={16} fill={colorVars.fc1} />}
      color={colorVars.fc1}
      disabled={!disableNext}
      className={styles.button}
      onClick={() => onClickNext()}
    >
      {t(Strings.next_record_plain)}
    </LinkButton>
  </div>
);
