import { Strings, t } from '@apitable/core';
import Image from 'next/image';
import { FC } from 'react';
import SearchImage from 'static/icon/common/common_img_search_default.png';
import styles from './style.module.less';

export const SearchEmpty: FC = () => {
  return (
    <div className={styles.searchEmpty}>
      <span className={styles.img}>
        <Image src={SearchImage} alt={t(Strings.no_search_result)} width={150} height={113} />
      </span>
      <span>{t(Strings.no_search_result)}</span>
    </div>
  );
};
