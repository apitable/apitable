import { FC } from 'react';
import WarnIcon from 'static/icon/common/common_tip_default_small.svg';
import styles from './style.module.less';
import { t, Strings } from '@vikadata/core';

interface IErrorContentProps {
  err?: string;
  init: () => void;
}
export const Fail: FC<IErrorContentProps> = props => {
  const { err, init } = props;
  return (
    <div className={styles.fail}>
      <span className={styles.errorIcon}>
        <WarnIcon />
      </span>
      <div className={styles.text}>
        <span>{err || t(Strings.import_failed)}</span>
        <div className={styles.gray}>{t(Strings.please)}
          <span onClick={init} className={styles.reload}>{t(Strings.upload_again)}</span>
        </div>
      </div>
    </div>
  );
};
