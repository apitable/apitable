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

import { Typography, useThemeColors } from '@apitable/components';
import { FieldGroup, FieldType, FieldTypeDescriptionMap, Strings, t } from '@apitable/core';
import { useMount, useSize, useUnmount } from 'ahooks';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { ScreenSize } from 'pc/components/common/component_display';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { useResponsive } from 'pc/hooks';
import * as React from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { getFieldTypeIcon } from '../field_setting';
import styles from './styles.module.less';
import { useShowTip } from './use_show_tip';

interface ITypeSelect {
  onClick: (type: number) => void;
  fieldIndex: number;
  currentFieldType: number;
  showAdvancedFields?: boolean;
}

const fieldSequence: FieldType[] = [
  FieldType.SingleText,
  FieldType.Text,
  FieldType.SingleSelect,
  FieldType.MultiSelect,
  FieldType.Link,
  FieldType.LookUp,
  FieldType.Formula,
  FieldType.Number,
  FieldType.Currency,
  FieldType.Percent,
  FieldType.AutoNumber,
  FieldType.DateTime,
  FieldType.CreatedTime,
  FieldType.LastModifiedTime,
  FieldType.Attachment,
  FieldType.Member,
  FieldType.CreatedBy,
  FieldType.LastModifiedBy,
  FieldType.Checkbox,
  FieldType.Rating,
  FieldType.URL,
  FieldType.Phone,
  FieldType.Email,
];

interface ITypeSelectItemProps extends ITypeSelect {
  setInfo: React.Dispatch<React.SetStateAction<{ top: number; title: string; desc: string }>>;
  fieldType: FieldType;
  index: number;
  fieldList: FieldType[];
  style?: React.CSSProperties;
}

const TypeSelectItem: React.FC<React.PropsWithChildren<ITypeSelectItemProps>> = props => {
  const { fieldList, fieldType, index, setInfo, style } = props;
  const colors = useThemeColors();
  const divRef = useRef<HTMLDivElement>(null);

  const onClick = () => {
    clearTipNode();
    setTimeout(() => {
      props.onClick(fieldType);
    }, 0);
  };

  useUnmount(() => {
    clearTipNode();
  });

  const { title, subTitle } = FieldTypeDescriptionMap[fieldType];

  const onMouseEnter = debounce(() => {
    if (divRef.current) {
      setInfo({
        top: divRef.current.getBoundingClientRect().top,
        title,
        desc: subTitle,
      });
    }
  }, 300);

  function clearTipNode() {
    onMouseEnter.cancel();
    setInfo({
      top: 0,
      title: '',
      desc: '',
    });
  }

  function getClassName() {
    if (fieldList.length % 3 === 0) {
      return styles.last3MarginBottom0;
    }
    if (fieldList.length % 3 === 2) {
      return styles.last2MarginBottom0;
    }
    return styles.last1MarginBottom0;
  }

  const isActiveFieldType = fieldType === props.currentFieldType;

  return (
    <div
      className={classNames(styles.typeSelectItem, {
        [styles.active]: fieldType === props.currentFieldType,
        [getClassName()]: true,
      })}
      onClick={onClick}
      key={index}
      onMouseOver={onMouseEnter}
      onMouseLeave={clearTipNode}
      onWheel={clearTipNode}
      ref={divRef}
      style={style}
    >
      <div className={styles.icon}>{getFieldTypeIcon(fieldType, isActiveFieldType ? colors.primaryColor : colors.thirdLevelText, 24, 24)}</div>
      <div className={styles.desc}>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
};

function filterCommonGroup(fieldType: FieldType) {
  return FieldTypeDescriptionMap[fieldType] && FieldTypeDescriptionMap[fieldType].fieldGroup === FieldGroup.Common;
}

function filterAdvanceGroup(fieldType: FieldType) {
  return FieldTypeDescriptionMap[fieldType] && FieldTypeDescriptionMap[fieldType].fieldGroup === FieldGroup.Advanced;
}

export const TypeSelectBase: React.FC<React.PropsWithChildren<ITypeSelect>> = props => {
  const colors = useThemeColors();
  const divRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollShadowRef = useRef<HTMLDivElement>(null);
  const { setInfo } = useShowTip(divRef.current!, 240)!;
  const [keyword, setKeyword] = React.useState('');
  const inputRef = useRef<{ focus(): void }>(null);

  const wrapperWidth = useSize(document.body)?.width;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const itemWidth = isMobile ? (wrapperWidth! - 80) / 3 : '';
  const itemStyle: React.CSSProperties = {
    width: itemWidth,
    height: itemWidth,
  };

  React.useEffect(() => {
    inputRef.current!.focus();
  }, []);

  const setSplitLineStyle = (hidden = true) => {
    const doms = document.querySelectorAll('span[role=presentation]');
    if (!doms.length) {
      return;
    }
    doms.forEach(dom => {
      dom.setAttribute('style', hidden ? 'display:none;' : '');
    });
  };

  useMount(() => {
    setSplitLineStyle();
  });

  useUnmount(() => {
    setSplitLineStyle(false);
  });

  function filterPrimaryType(fieldType: FieldType) {
    if (props.fieldIndex !== 0) return true;
    return FieldTypeDescriptionMap[fieldType] && FieldTypeDescriptionMap[fieldType].canBePrimaryField;
  }

  const onScroll = ({ scrollTop, height, scrollHeight }: { scrollTop: number, height: number, scrollHeight: number }) => {
    const shadowEle = scrollShadowRef.current;
    if (!shadowEle) return;
    if (scrollTop + height > scrollHeight - 10) {
      shadowEle.style.display = 'none';
      return;
    }
    if (shadowEle.style.display === 'block') {
      return;
    }
    shadowEle.style.display = 'block';
  };

  const onCalcSize = React.useCallback(() => {
    const clientHeight = window.innerHeight;
    const LIMIT = 50;
    const TOP_LIMIT = LIMIT;
    const BOTTOM_LIMIT = clientHeight - LIMIT;
    const divEle = divRef.current;
    const scrollEle = scrollRef.current;
    if (!divEle || !scrollEle) return;
    const parentNode = divEle.parentElement!;
    const { top, bottom, height } = parentNode.getBoundingClientRect();
    let diff = 0;
    if (bottom > BOTTOM_LIMIT) {
      diff = bottom - BOTTOM_LIMIT;
    }
    const _top = top - diff;
    let eleHeight = 0;
    if (_top < TOP_LIMIT) {
      eleHeight = clientHeight - 2 * LIMIT;
      divEle.style.height = eleHeight + 'px';
      parentNode.style.top = `-${top - TOP_LIMIT}px`;
    } else {
      const scrollHeight = scrollRef.current.clientHeight;
      const totalHeight = height - scrollHeight + scrollRef.current.scrollHeight;
      const spaceHeight = clientHeight - 2 * LIMIT;
      const resultHeight = Math.min(spaceHeight, totalHeight);
      eleHeight = resultHeight;
      divEle.style.height = eleHeight + 'px';
      parentNode.style.top = `-${diff}px`;
    }
    onScroll({ height: scrollEle.clientHeight, scrollTop: scrollEle.scrollTop, scrollHeight: scrollEle.scrollHeight });
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;
    onCalcSize();
  }, [onCalcSize, divRef, scrollRef, scrollShadowRef, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('resize', onCalcSize);
    return () => window.removeEventListener('resize', onCalcSize);
  }, [isMobile, onCalcSize]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const ele = e.target as HTMLDivElement;
    const { clientHeight, scrollHeight, scrollTop } = ele;
    onScroll({ height: clientHeight, scrollHeight, scrollTop });
  };

  const filterByKeyword = (fieldType: FieldType) => {
    const fieldTitle = FieldTypeDescriptionMap[fieldType].title;
    return fieldTitle.toLowerCase().includes(keyword.trim().toLowerCase());
  };

  const basicFieldList = fieldSequence
    .filter(filterPrimaryType)
    .filter(filterCommonGroup)
    .filter(filterByKeyword);

  const advanceFieldList = fieldSequence
    .filter(filterPrimaryType)
    .filter(filterAdvanceGroup)
    .filter(filterByKeyword);

  return (
    <div className={styles.typeSelect} ref={divRef}>
      {!isMobile && <h1>{t(Strings.select_one_field)}</h1>}
      {props.fieldIndex === 0 && (
        <div style={{ padding: '0 24px', marginBottom: 8 }}>
          <Typography variant="body4" color={colors.fc3}>
            {t(Strings.tooltip_primary_field_type_select)}
          </Typography>
        </div>
      )}
      <LineSearchInput onChange={onChange} className={styles.searchInput} ref={inputRef} value={keyword} onClear={() => setKeyword('')} allowClear />
      <div className={styles.scroll} ref={scrollRef} onScroll={handleScroll}>
        {Boolean(basicFieldList.length) && (
          <section className={styles.fieldDisplayList}>
            <h2>{t(Strings.basis)}</h2>
            <main>
              {basicFieldList.map((item, index, array) => {
                return <TypeSelectItem {...props} setInfo={setInfo} index={index} key={index} fieldType={item} fieldList={array} style={itemStyle} />;
              })}
            </main>
          </section>
        )}
        {Boolean(advanceFieldList.length) && props.showAdvancedFields && (
          <section className={styles.fieldDisplayList}>
            <h2>{t(Strings.advanced)}</h2>
            <main>
              {advanceFieldList.map((item, index, array) => {
                return <TypeSelectItem {...props} setInfo={setInfo} index={index} key={index} fieldType={item} fieldList={array} style={itemStyle} />;
              })}
            </main>
          </section>
        )}
        {!(basicFieldList.length + advanceFieldList.length) && (
          <div className={styles.noSearchTip}>
            {t(Strings.no_search_field, {
              keyword: keyword,
            })}
          </div>
        )}
      </div>
      <div ref={scrollShadowRef} className={classNames(!isMobile && styles.scrollShadow)} />
    </div>
  );
};

export const TypeSelect = React.memo(TypeSelectBase);
