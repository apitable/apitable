import { FC } from 'react';
import styles from './style.module.less';
import { UpgradeColorfulFilled } from '@vikadata/icons';
import classNames from 'classnames';
import { getLanguage, Strings, t } from '@apitable/core';

interface IUpgradeBtnProps {
  onClick: () => void
}

export const UpgradeBtn: FC<IUpgradeBtnProps> = ({ onClick }) => {
  const isZhCN = getLanguage() === 'zh-CN';
  return (
    <div
      className={styles.stickyUpgrade}
      style={{ height: isZhCN ? undefined : 120 }}
    >
      <div
        className={styles.stickyUpgradeContent}
        onClick={onClick}
      >
        <UpgradeColorfulFilled />
        <span className={classNames(styles.stickyUpgradeText, { rotate: !isZhCN })}>
          {t(Strings.upgrade_pure)}
        </span>
      </div>
    </div>
  );
};
