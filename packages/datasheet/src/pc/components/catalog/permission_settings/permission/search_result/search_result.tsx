import { IUnit, Strings, t, UnitItem } from '@vikadata/core';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Image from 'next/image';
import { FC } from 'react';
import NotDataImg from 'static/icon/common/common_img_search_default.png';
import styles from './style.module.less';

export interface ISearchResultProps {
  // 数据源（搜索的结果）
  data: IUnit | null;
  // 要过滤的组织单元的unitId集合
  filterData?: string[];
  // 已选列表
  checkedList: UnitItem[];
  // 选中
  onChangeChecked?: (e: CheckboxChangeEvent, unit: UnitItem) => void;
}

export const SearchResult: FC<ISearchResultProps> = ({ data, children }) => {

  if (!data || (!data.teams.length && !data.tags.length && !data.members.length)) {
    return (
      <div className={styles.notData}>
        <span style={{ marginTop: 40 }}>
          <Image src={NotDataImg} alt={t(Strings.no_search_result)} width={160} height={120} />
        </span>
        <div className={styles.tip}>{t(Strings.no_search_result)}</div>
      </div>
    );
  }

  return (
    <div className={styles.searchResult}>
      {children}
    </div>
  );
};
