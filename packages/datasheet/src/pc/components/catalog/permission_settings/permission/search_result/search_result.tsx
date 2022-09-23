import { Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { FC } from 'react';
import NotDataImg from 'static/icon/common/common_img_search_default.png';
import styles from './style.module.less';

export interface ISearchResultProps {
  isEmpty?: boolean;
}

export const SearchResult: FC<ISearchResultProps> = ({ isEmpty, children }) => {
  if (isEmpty) {
    return (
      <div className={styles.notData}>
        <span style={{ marginTop: 40 }}>
          <Image src={NotDataImg} alt={t(Strings.no_search_result)} width={160} height={120} />
        </span>
        <div className={styles.tip}>{t(Strings.no_search_result)}</div>
      </div>
    );
  }

  return <div className={styles.searchResult}>{children}</div>;
};
