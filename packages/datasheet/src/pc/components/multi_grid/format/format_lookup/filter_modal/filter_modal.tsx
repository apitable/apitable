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

import produce from 'immer';
import { FC, useMemo, useCallback } from 'react';
import * as React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Button } from '@apitable/components';
import { t, Strings, IFilterInfo, IFilterCondition, FilterConjunction, ILookUpField, Selectors, FieldType, ILookUpSortInfo } from '@apitable/core';
import { BaseModal, Message } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { ModalViewFilter } from 'pc/components/tool_bar/view_filter';
import { useAppSelector } from 'pc/store/react-redux';
import { CommonViewSet } from '../common_view_set';
import { SortFieldOptions } from '../sort_field_options';
import styles from './style.module.less';

interface IFilterModalProps extends IModalProps {
  title?: React.ReactNode;
  handleCancel: () => void;
  datasheetId: string;
  handleOk: (value: any, sortInfo: ILookUpSortInfo) => void;
  okBtnDisabled?: boolean;
  className?: string;
  filterInfo?: IFilterInfo;
  field?: ILookUpField;
  sortInfo?: ILookUpSortInfo;
  filterModalVisible?: boolean;
}

export const FilterModal: FC<React.PropsWithChildren<IFilterModalProps>> = (props) => {
  const { title, handleCancel, datasheetId, handleOk, field, filterModalVisible } = props;
  const [filterInfo, setFilters] = React.useState(
    props.filterInfo || {
      conditions: [] as IFilterCondition[],
      conjunction: FilterConjunction.And,
    },
  );

  const [sortInfo, setSortInfo] = React.useState<ILookUpSortInfo>(props.sortInfo || { rules: [] });
  const sortFieldIds = sortInfo ? sortInfo.rules.map((item) => item.fieldId) : [];
  const fieldMap = useAppSelector((state) => {
    return Selectors.getFieldMap(state, datasheetId);
  })!;
  const [optionsVisible, setOptionsVisible] = React.useState<boolean | undefined>(false);
  React.useEffect(() => {
    setOptionsVisible(filterModalVisible);
  }, [filterModalVisible]);

  const handleSubmit = () => {
    handleOk(filterInfo, sortInfo);
    Message.success({ content: t(Strings.lookup_conditions_success) });
    handleCancel();
  };
  function setSortField(index: number, fieldId: string) {
    const newSortInfo = produce(sortInfo, (draft: ILookUpSortInfo) => {
      if (!draft) {
        return {
          // keepSort: true,
          rules: [{ fieldId, desc: false }],
        };
      }
      draft.rules[index] = { fieldId, desc: false };
      return draft;
    });
    submitSort(newSortInfo);
  }

  function submitSort(sortInfo: ILookUpSortInfo) {
    setSortInfo(sortInfo);
  }

  const invalidFieldsByGroup = useMemo(() => {
    const invalidFields: string[] = [];
    sortInfo.rules.forEach((item) => {
      const field = fieldMap[item.fieldId];
      // Sorting is invalid after non-multi-selected FieldType grouping.
      if (field && ![FieldType.MultiSelect].includes(field.type)) {
        invalidFields.push(field.id);
      }
    });
    console.log(invalidFields);
    return invalidFields;
  }, [sortInfo, fieldMap]);
  const mainContentStyle: React.CSSProperties = {
    padding: '0',
    marginTop: '0',
  };

  // Modify the order after the end of dragging.
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
      submitSort(
        produce(sortInfo, (draft) => {
          draft!.rules.splice(destination.index, 0, draft!.rules.splice(source.index, 1)[0]);
          return draft;
        })!,
      );
    },
    // eslint-disable-next-line
    [sortInfo],
  );

  function setSortRules(index: number, desc: boolean) {
    const newSortInfo = produce(sortInfo, (draft: ILookUpSortInfo) => {
      draft!.rules.forEach((item, idx) => {
        if (idx === index) {
          item.desc = desc;
        }
        return item;
      });
      return draft!;
    });
    submitSort(newSortInfo!);
  }

  function deleteViewItem(index: number) {
    if (sortInfo) {
      const newSortInfo = produce(sortInfo, (draft) => {
        draft.rules.splice(index, 1);
        return draft;
      });
      submitSort(newSortInfo);
    }
  }

  const onClose = () => {
    handleCancel();
  };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <BaseModal visible centered width={720} title={title} onCancel={handleCancel} onOk={handleSubmit} className={styles.filterModal}>
          <div className={styles.modalList}>
            <div className={styles.title}>
              <h3>{t(Strings.rollup_filter_sort_popup_setting)}</h3>
              <div className={styles.modalSubtitle}>{t(Strings.sorting_conditions_setting_description)}</div>
            </div>
            {sortInfo.rules.length > 0 && (
              <main style={mainContentStyle}>
                <CommonViewSet
                  onDragEnd={onDragEnd}
                  dragData={sortInfo.rules}
                  setField={setSortField}
                  existFieldIds={sortFieldIds}
                  setRules={setSortRules}
                  deleteItem={deleteViewItem}
                  invalidFieldIds={invalidFieldsByGroup}
                  datasheetId={datasheetId}
                />
              </main>
            )}
            {sortInfo.rules.length === 0 && (
              <div className={styles.selectField}>
                <SortFieldOptions
                  onChange={setSortField.bind(null, 0)}
                  defaultFieldId={t(Strings.add_sort)}
                  existFieldIds={sortFieldIds}
                  invalidFieldIds={invalidFieldsByGroup}
                  invalidTip={t(Strings.invalid_option_sort_tip)}
                  isAddNewOption={sortInfo.rules.length === 0}
                  datasheetId={datasheetId}
                />
              </div>
            )}
          </div>
          <div className={styles.modalList}>
            <div className={styles.title}>
              <h3>{t(Strings.filtering_conditions_setting)}</h3>
              <div className={styles.modalSubtitle}>{t(Strings.to_filter_link_data)}</div>
            </div>
            <ModalViewFilter datasheetId={datasheetId} setFilters={setFilters} filterInfo={filterInfo} field={field} />
          </div>
        </BaseModal>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          open={optionsVisible}
          title={title}
          height="99%"
          onClose={onClose}
          className={styles.optionsListMenu}
          footer={
            <Button color="primary" size="large" block onClick={() => handleSubmit()}>
              {t(Strings.confirm)}
            </Button>
          }
        >
          <div>
            <div className={styles.modalList}>
              <div className={styles.title}>
                <h3>{t(Strings.rollup_filter_sort_popup_setting)}</h3>
                <div className={styles.modalSubtitle}>{t(Strings.sorting_conditions_setting_description)}</div>
              </div>
              {sortInfo && (
                <main style={mainContentStyle}>
                  <CommonViewSet
                    onDragEnd={onDragEnd}
                    dragData={sortInfo.rules}
                    setField={setSortField}
                    existFieldIds={sortFieldIds}
                    setRules={setSortRules}
                    deleteItem={deleteViewItem}
                    invalidFieldIds={invalidFieldsByGroup}
                    datasheetId={datasheetId}
                  />
                </main>
              )}
              {sortInfo.rules.length === 0 && (
                <div className={styles.selectField}>
                  <SortFieldOptions
                    onChange={setSortField.bind(null, sortFieldIds.length)}
                    defaultFieldId={t(Strings.add_sort)}
                    existFieldIds={sortFieldIds}
                    invalidFieldIds={invalidFieldsByGroup}
                    invalidTip={t(Strings.invalid_option_sort_tip)}
                    isAddNewOption={sortInfo.rules.length > 0}
                    datasheetId={datasheetId}
                  />
                </div>
              )}
            </div>
            <div className={styles.modalList}>
              <div className={styles.title}>
                <h3>{t(Strings.add_filter)}</h3>
                <div className={styles.modalSubtitle}>{t(Strings.to_filter_link_data)}</div>
              </div>
              <ModalViewFilter datasheetId={datasheetId} setFilters={setFilters} filterInfo={filterInfo} field={field} />
            </div>
          </div>
        </Popup>
      </ComponentDisplay>
    </>
  );
};
