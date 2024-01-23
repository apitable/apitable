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
import { useCallback, useState } from 'react';
import * as React from 'react';
import { SortableElement as sortableElement, SortableContainer as sortableContainer } from 'react-sortable-hoc';
import { colorVars } from '@apitable/components';
import { ISelectFieldOption, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { CommonList } from 'pc/components/list/common_list';
import { useAppSelector } from 'pc/store/react-redux';
import { Check } from '../common_list/check';
import { OptionItem } from './option_item';
import { IOptionListProps } from './option_list.interface';
import styles from './style.module.less';

const SortableContainer: any = sortableContainer(({ children }: any) => {
  return <div className={styles.sortableContainer}>{children}</div>;
});

const SortableItem: any = sortableElement(({ children }: any) => <>{children}</>);

export const OptionList: React.FC<React.PropsWithChildren<IOptionListProps>> = (props) => {
  const {
    listData: optionList,
    existValues,
    onAddHandle,
    multiMode,
    onClickItem,
    dragOption,
    setCurrentField,
    inputRef,
    monitorId,
    datasheetId,
    placeholder,
  } = props;
  const [keyword, setKeyword] = useState('');
  const manageable = useAppSelector((state) => Selectors.getPermissions(state, datasheetId).manageable);
  const { formId } = useAppSelector((state) => state.pageParams);
  const showNotAllowAddTip = Boolean(!manageable && keyword.length); // Does it prompt the user not to add new options
  const optionByFilter = optionList.filter(filterOptions);
  const allowAddNewItem = Boolean(onAddHandle) && manageable;

  function filterOptions(item: ISelectFieldOption) {
    // Search supports case, refer to the antd rc select library
    return item.name.toUpperCase().includes(keyword.toUpperCase());
  }

  function _onAddHandle() {
    onAddHandle &&
      onAddHandle(keyword, () => {
        setKeyword('');
      });
  }

  function getExactMatchResult() {
    if (!keyword.length) {
      return;
    }
    return optionList.filter((item) => item.name === keyword)[0];
  }

  // Toggles the selection status of the current option
  function switchOptionsStatus(id: string) {
    let value;
    if (!Array.isArray(existValues) && typeof existValues !== 'string') {
      // Just changed the type of field, the current optionData === {}
      value = multiMode ? [id] : id;
    } else if (multiMode) {
      if (existValues.includes(id)) {
        value = (existValues as string[]).filter((item) => item !== id);
      } else {
        value = [...existValues, id];
      }
    } else {
      if (existValues.includes(id)) {
        value = '';
      } else {
        value = id;
      }
    }

    onClickItem(value as any);
  }

  // The swap in the filter condition should get the true index of the current option in the original array
  const getActualIndexOfOptions = useCallback(
    (optionId: string) => {
      return optionList.findIndex((item) => item.id === optionId);
    },
    [optionList],
  );

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    dragOption!.setDraggingId(undefined);
    let actualOldIndex = oldIndex;
    let actualNewIndex = newIndex;
    // Description with filter keywords
    if (keyword.length > 0) {
      const filterOptionsArr = optionList.filter(filterOptions);
      actualOldIndex = getActualIndexOfOptions(filterOptionsArr[oldIndex].id);
      actualNewIndex = getActualIndexOfOptions(filterOptionsArr[newIndex].id);
    }

    dragOption!.afterDrag(actualOldIndex, actualNewIndex);
  };

  const onKeyEnter = (clearKeyword: () => void) => {
    const matchResult = getExactMatchResult();
    clearKeyword();
    if (!matchResult) {
      return _onAddHandle();
    }
    switchOptionsStatus(matchResult!.id);
  };

  const createOptionItem = (option: ISelectFieldOption, index: number) => {
    return (
      <CommonList.Option
        key={option.id}
        currentIndex={index}
        id={option.id}
        wrapperComponent={(child) => {
          return (
            <SortableItem index={index} key={option.id}>
              {child}
            </SortableItem>
          );
        }}
        className={styles.optionItemWrapper}
      >
        <OptionItem
          curOption={option}
          getRealIndexOfOptions={getActualIndexOfOptions}
          setCurrentField={setCurrentField}
          fieldEditable={manageable}
          dragOption={dragOption}
        />
        <Check isChecked={Boolean(existValues && existValues.includes(option.id!))} />
      </CommonList.Option>
    );
  };

  const renderFooter = () => {
    if (formId) {
      return null;
    }
    if (allowAddNewItem && keyword.length) {
      return (
        <div className={classNames(styles.addNewItem)} onClick={_onAddHandle}>
          <AddOutlined size={10} color={colorVars.thirdLevelText} />
          <span>{t(Strings.add)}</span>
          <span>「{keyword}」</span>
        </div>
      );
    }
    if (showNotAllowAddTip) {
      return (
        <div
          className={classNames(styles.addNewItem)}
          style={{
            color: colorVars.thirdLevelText,
          }}
        >
          {t(Strings.no_permission_add_option)}
        </div>
      );
    }
    return null;
  };

  return (
    <CommonList
      value={existValues || []}
      onClickItem={(_e, index) => {
        switchOptionsStatus(optionByFilter[index].id);
      }}
      noDataTip={t(Strings.no_option)}
      footerComponent={renderFooter}
      showInput
      inputRef={inputRef}
      onSearchChange={(_e, keyword) => {
        setKeyword(keyword);
      }}
      monitorId={monitorId}
      onInputEnter={onKeyEnter}
      inputStyle={{ padding: 8 }}
      inputPlaceHolder={placeholder || (formId ? t(Strings.find) : t(Strings.search_or_add))}
      getListContainer={(children) => (
        <SortableContainer distance={5} useDragHandle onSortEnd={onSortEnd}>
          {children}
        </SortableContainer>
      )}
    >
      {optionByFilter.map(createOptionItem)}
    </CommonList>
  );
};
