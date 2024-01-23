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

import { isNumber } from 'util';
import classNames from 'classnames';
import * as React from 'react';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Radio, RadioGroup, Select, Switch, TextButton, useThemeColors } from '@apitable/components';
import {
  BasicValueType,
  DateTimeField,
  Field,
  FieldType,
  Functions,
  IField,
  IFilterInfo,
  ILookUpField,
  ILookUpProperty,
  ILookUpSortInfo,
  LookUpField,
  LookUpLimitType,
  NOT_FORMAT_FUNC_SET,
  RollUpFuncType,
  Selectors,
  StringKeysMapType,
  Strings,
  t,
} from '@apitable/core';
import { ChevronRightOutlined, QuestionCircleOutlined, WarnCircleFilled, WarnCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Message, MobileSelect, Modal, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { InlineNodeName } from 'pc/components/common/inline_node_name';
import { TComponent } from 'pc/components/common/t_component';
import { FilterModal } from 'pc/components/multi_grid/format/format_lookup/filter_modal/filter_modal';
import { LinkFieldPanel } from 'pc/components/multi_grid/format/format_lookup/link_field_panel';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import settingStyles from '../../field_setting/styles.module.less';
import styles from '../styles.module.less';
import { MyTrigger } from '../trigger';
import { LookUpFormatDateTime } from './lookup_format_datetime';
import { LookUpFormatNumber } from './lookup_format_number';
import { SearchSelectField } from './search_select_field';
import lookupStyles from './styles.module.less';

const Option = Select.Option;

interface IFormateLookUpProps {
  currentField: ILookUpField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  datasheetId?: string;
}

interface IRollUpFunction {
  value: string;
  name: keyof StringKeysMapType;
  label: string;
  example: string;
}

export const RollUpFuncNameMap = {
  [RollUpFuncType.VALUES]: Strings.lookup_values,
  [RollUpFuncType.AVERAGE]: Strings.lookup_average,
  [RollUpFuncType.COUNT]: Strings.lookup_count,
  [RollUpFuncType.COUNTA]: Strings.lookup_counta,
  [RollUpFuncType.COUNTALL]: Strings.lookup_countall,
  [RollUpFuncType.SUM]: Strings.lookup_sum,
  [RollUpFuncType.MIN]: Strings.lookup_min,
  [RollUpFuncType.MAX]: Strings.lookup_max,
  [RollUpFuncType.AND]: Strings.lookup_and,
  [RollUpFuncType.OR]: Strings.lookup_or,
  [RollUpFuncType.XOR]: Strings.lookup_xor,
  [RollUpFuncType.CONCATENATE]: Strings.lookup_concatenate,
  [RollUpFuncType.ARRAYJOIN]: Strings.lookup_arrayjoin,
  [RollUpFuncType.ARRAYUNIQUE]: Strings.lookup_arrayunique,
  [RollUpFuncType.ARRAYCOMPACT]: Strings.lookup_arraycompact,
};

export const assignDefaultFormatting = (showFormatType: BasicValueType, newCurrentField: IField) => {
  if (showFormatType === BasicValueType.DateTime) {
    return {
      ...newCurrentField,
      property: {
        ...newCurrentField.property,
        formatting: { ...DateTimeField.defaultProperty(), ...newCurrentField.property.formatting },
      },
    };
  }
  if (showFormatType === BasicValueType.Number || showFormatType === BasicValueType.Boolean) {
    const fieldFormatting = () => ({
      symbol: '$',
      precision: 0,
      formatType: FieldType.Number,
    });
    return {
      ...newCurrentField,
      property: {
        ...newCurrentField.property,
        formatting: {
          ...fieldFormatting(),
          ...newCurrentField.property.formatting,
        },
      },
    };
  }
  return newCurrentField;
};

export const FormateLookUp: React.FC<React.PropsWithChildren<IFormateLookUpProps>> = memo((props: IFormateLookUpProps) => {
  const colors = useThemeColors();
  const { currentField, setCurrentField, datasheetId } = props;
  const activeDstId = useAppSelector((state) => datasheetId || Selectors.getActiveDatasheetId(state))!;
  const { relatedLinkFieldId, lookUpTargetFieldId, rollUpType, filterInfo, openFilter = false, sortInfo, lookUpLimit } = currentField.property;
  const relatedLinkField = Field.bindModel(currentField).getRelatedLinkField();
  const { error: isFilterError, typeSwitch: isFilterTypeSwitch } = Field.bindModel(currentField).checkFilterInfo();

  const [filterModal, setFilterModal] = useState(false);
  const foreignDatasheetFieldMap = useAppSelector(
    (state) => relatedLinkField && Selectors.getFieldMap(state, relatedLinkField.property.foreignDatasheetId),
  );
  const [showDatasheetPanel, setShowDatasheetPanel] = useState(false);
  const linkFields = Field.bindModel(currentField).getLinkFields();

  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, activeDstId));
  const hasLinkField = Object.values(fieldMap!).some((field) => [FieldType.Link, FieldType.OneWayLink].includes(field.type)) || false;

  const foreignDatasheetReadable = useAppSelector((state) => Selectors.getPermissions(state, relatedLinkField?.property.foreignDatasheetId).readable);

  const lookUpField = foreignDatasheetFieldMap && foreignDatasheetFieldMap[lookUpTargetFieldId];

  const getFieldValueType = (field: ILookUpField) => {
    let showFormatType = lookUpField ? LookUpField.bindModel(field).basicValueType : BasicValueType.String;
    showFormatType = showFormatType === BasicValueType.Array ? (LookUpField.bindModel(field!) as any).innerBasicValueType : showFormatType;
    return showFormatType;
  };
  const showFormatType = getFieldValueType(currentField);

  const renderInlineNodeName = (prefix: string, dstId: string, style?: React.CSSProperties) => {
    const datasheet = Selectors.getDatasheet(store.getState(), dstId);
    return (
      <InlineNodeName
        nodeNameStyle={style}
        iconEditable={false}
        nodeId={dstId}
        nodeName={datasheet?.name}
        nodeIcon={datasheet?.icon}
        prefix={prefix}
        size={14}
        iconSize={16}
        withIcon
        withBrackets
      />
    );
  };

  useEffect(() => {
    setCurrentField(assignDefaultFormatting(showFormatType, currentField));
    // eslint-disable-next-line
  }, [showFormatType]);

  const getRollUpFunctions = () => {
    return Object.values(RollUpFuncType)
      .filter((item) => !isNumber(item))
      .map((func: RollUpFuncType) => {
        if (func === RollUpFuncType.VALUES) {
          const funcName = RollUpFuncNameMap[func];
          return {
            value: func,
            name: funcName,
            label: t(Strings.lookup_values_summary),
            example: '',
          };
        }
        const formulaFunc = Functions.get(func);
        const lowerCaseFuncName = func.toLowerCase();
        if (formulaFunc) {
          return {
            value: func,
            name: `lookup_${lowerCaseFuncName}`,
            label: t(Strings[`lookup_${lowerCaseFuncName}_summary`]),
            example: t(Strings[`lookup_${lowerCaseFuncName}_example`]),
          };
        }
        return false;
      })
      .filter((i) => Boolean(i)) as IRollUpFunction[];
  };

  const setFieldProperty = (propertyKey: keyof ILookUpProperty) => (value: any, newFilterInfo?: any) => {
    if (currentField.property[propertyKey] !== value || newFilterInfo) {
      const updateField = (newProperty: Partial<ILookUpProperty> = {}) => {
        const newField = {
          ...currentField,
          property: {
            ...currentField.property,
            [propertyKey]: value,
            ...newProperty,
            datasheetId: activeDstId,
          },
        };
        const showFormatType = getFieldValueType(newField);
        setCurrentField(assignDefaultFormatting(showFormatType, newField));
      };

      // Switching link field will cause the filter data to be cleared, giving a hint
      if (propertyKey === 'relatedLinkFieldId' && openFilter) {
        Modal.confirm({
          title: t(Strings.operate_info),
          content: t(Strings.confirm_link_toggle_clear_filter),
          okText: t(Strings.submit),
          cancelText: t(Strings.give_up_edit),
          onOk: () => updateField({ openFilter: false, filterInfo: undefined, sortInfo: undefined, lookUpLimit: LookUpLimitType.ALL }),
        });
      } else if (
        // Closing the filter button will cause the filter data to be cleared, giving a prompt
        propertyKey === 'openFilter' &&
        openFilter &&
        (Boolean(filterInfo && filterInfo.conditions.length > 0) || Boolean(sortInfo && sortInfo.rules.length > 0))
      ) {
        Modal.confirm({
          title: t(Strings.operate_info),
          content: t(Strings.comfirm_close_filter_switch),
          okText: t(Strings.submit),
          cancelText: t(Strings.give_up_edit),
          onOk: () => updateField({ filterInfo: undefined, sortInfo: undefined }),
        });
      } else if (propertyKey === 'sortInfo' && openFilter) {
        updateField({
          filterInfo: newFilterInfo && newFilterInfo.conditions.length > 0 ? newFilterInfo : undefined,
          sortInfo: value.rules.length > 0 ? value : undefined,
        });
      } else {
        updateField();
      }
    }
  };

  const handleForeignDstReadable = () => {
    if (!foreignDatasheetReadable) {
      Message.warning({
        content: t(Strings.lookup_configuration_no_link_ds_permission),
      });
      return false;
    }
    return true;
  };
  const popupAlign = {
    points: ['tc', 'bc'],
    offset: [0, 0],
    overflow: {
      adjustX: true,
      adjustY: true,
    },
  };

  const popupStyle: React.CSSProperties = {
    zIndex: 9999,
  };

  return (
    <>
      <section className={settingStyles.section} style={{ marginBottom: 0 }}>
        <div className={classNames(settingStyles.sectionTitle, styles.infoTip)} style={{ marginBottom: 8 }}>
          <span>{t(Strings.rollup_choose_table)}</span>
          <Tooltip title={t(Strings.rollup_choose_table_description)} trigger={'hover'}>
            <div className={styles.infoIcon}>
              <QuestionCircleOutlined size={16} color={colors.thirdLevelText} />
            </div>
          </Tooltip>
        </div>
        <MyTrigger
          showPopup={showDatasheetPanel}
          setShowPopup={setShowDatasheetPanel}
          popupAlign={popupAlign}
          popupStyle={popupStyle}
          popup={
            <LinkFieldPanel
              fields={linkFields}
              activeFieldId={relatedLinkFieldId}
              setSearchPanelVisible={setShowDatasheetPanel}
              onChange={setFieldProperty('relatedLinkFieldId')}
            />
          }
          trigger={
            <SearchSelectField
              datasheetId={datasheetId}
              defaultFieldId={relatedLinkFieldId}
              onChange={setFieldProperty('relatedLinkFieldId')}
              fieldType={[FieldType.Link, FieldType.OneWayLink]}
              disabled={!hasLinkField}
            />
          }
        />

        {!hasLinkField && (
          <div className={styles.warnInfo}>
            <WarnCircleOutlined color={colors.textCommonQuaternary} size={16} className={settingStyles.warningIcon} />
            <span>{t(Strings.lookup_field_err)}</span>
          </div>
        )}
      </section>
      {hasLinkField && (
        <section className={classNames(settingStyles.section)} style={{ marginBottom: 0, marginTop: 16 }}>
          <div className={classNames(settingStyles.sectionTitle, settingStyles.flex)} style={{ marginBottom: 4 }}>
            <TComponent
              tkey={t(Strings.rollup_choose_field)}
              params={{
                name: renderInlineNodeName('', relatedLinkField?.property.foreignDatasheetId!, { maxWidth: '90px' }),
              }}
            />
          </div>
          <SearchSelectField
            datasheetId={relatedLinkField?.property.foreignDatasheetId}
            defaultFieldId={lookUpTargetFieldId}
            onChange={setFieldProperty('lookUpTargetFieldId')}
            disabled={!Boolean(relatedLinkFieldId)}
          />
          <div className={classNames(settingStyles.sectionTitle, styles.enhance)}>
            {t(Strings.rollup_filter_sort)}
            <Switch
              size="small"
              onChange={() => {
                const isForeignDstReadable = handleForeignDstReadable();
                isForeignDstReadable && setFieldProperty('openFilter')(!openFilter);
              }}
              checked={openFilter}
              disabled={!Boolean(lookUpTargetFieldId)}
            />
          </div>
          {openFilter &&
            lookUpTargetFieldId &&
            (!isFilterError ? (
              <div
                className={classNames(styles.sectionInfo)}
                style={{ marginBottom: 16 }}
                onClick={() => {
                  const isForeignDstReadable = handleForeignDstReadable();
                  isForeignDstReadable && setFilterModal(true);
                }}
              >
                {isFilterTypeSwitch && (
                  <Tooltip title={t(Strings.loopkup_filter_pane_tip)} placement="top">
                    <WarnCircleFilled color={colors.warningColor} size={16} className={settingStyles.warningIcon} />
                  </Tooltip>
                )}
                <div
                  className={classNames(settingStyles.text, styles.selectText, {
                    [styles.filterSelected]:
                      (filterInfo?.conditions && filterInfo?.conditions?.length > 0) || (sortInfo?.rules && sortInfo?.rules.length > 0),
                  })}
                >
                  <span>
                    {!filterInfo?.conditions.length && !sortInfo?.rules.length
                      ? t(Strings.lookup_filter_sort_description)
                      : t(Strings.rollup_conditions_num, {
                        FILTER_NUM: filterInfo?.conditions.length || 0,
                        ORDER_BY_NUM: sortInfo?.rules.length || 0,
                      })}
                  </span>
                </div>
                <div className={settingStyles.arrow}>
                  <ChevronRightOutlined size={16} color={colors.thirdLevelText} />
                </div>
              </div>
            ) : (
              <div className={settingStyles.sectionClear}>
                <div>
                  <WarnCircleFilled color={colors.warningColor} size={16} className={settingStyles.warningIcon} />
                  {t(Strings.filter_delete_tip)}
                </div>
                <TextButton color="danger" size="small" onClick={() => setFieldProperty('filterInfo')(undefined)}>
                  {t(Strings.clear)}
                </TextButton>
              </div>
            ))}
          {relatedLinkFieldId && relatedLinkField && lookUpTargetFieldId && (
            <div className={classNames(settingStyles.limitSelect, styles.borderTop)}>
              <div className={settingStyles.sectionTitle}>{t(Strings.rollup_limit)}</div>
              <ComponentDisplay minWidthCompatible={ScreenSize.md}>
                <Select
                  value={lookUpLimit || LookUpLimitType.ALL}
                  onSelected={({ value }) => {
                    setFieldProperty('lookUpLimit')(value);
                  }}
                >
                  <Option value={LookUpLimitType.FIRST} key={LookUpLimitType.FIRST} currentIndex={0}>
                    {t(Strings.rollup_limit_option_2)}
                  </Option>
                  <Option value={LookUpLimitType.ALL} key={LookUpLimitType.ALL} currentIndex={1}>
                    {t(Strings.rollup_limit_option_1)}
                  </Option>
                </Select>
              </ComponentDisplay>
              <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
                <RadioGroup
                  name="btn-group-with-default"
                  isBtn
                  value={lookUpLimit || LookUpLimitType.ALL}
                  block
                  onChange={(_e, value) => {
                    setFieldProperty('lookUpLimit')(value);
                  }}
                >
                  <Radio value={LookUpLimitType.FIRST}>{t(Strings.rollup_limit_option_2)}</Radio>
                  <Radio value={LookUpLimitType.ALL}>{t(Strings.rollup_limit_option_1)}</Radio>
                </RadioGroup>
              </ComponentDisplay>
            </div>
          )}
          {filterModal && relatedLinkField && (
            <FilterModal
              filterModalVisible={filterModal}
              field={currentField}
              handleCancel={() => setFilterModal(false)}
              datasheetId={relatedLinkField.property.foreignDatasheetId!}
              filterInfo={filterInfo}
              sortInfo={sortInfo}
              handleOk={(filterInfo: IFilterInfo, sortInfo: ILookUpSortInfo) => {
                setFieldProperty('sortInfo')(sortInfo, filterInfo);
              }}
            />
          )}
        </section>
      )}
      {Boolean(relatedLinkFieldId && lookUpTargetFieldId) && (
        <section className={classNames(settingStyles.section, styles.sectionTop)}>
          <div className={settingStyles.sectionTitle}>{t(Strings.statistical_link_data)}</div>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Select
              value={rollUpType || RollUpFuncType.VALUES}
              onSelected={({ value }) => {
                setFieldProperty('rollUpType')(value);
              }}
            >
              {getRollUpFunctions().map((func, index) => {
                return (
                  <Option value={func.value} key={func.value} currentIndex={index}>
                    <Tooltip
                      mouseEnterDelay={0.5}
                      placement="left"
                      title={
                        <div>
                          <div className={lookupStyles.funcLabelName}>
                            {t(func.name as any)} ({func.value})
                          </div>
                          <div className={lookupStyles.funcLabel}>{func.label}</div>
                          <div className={lookupStyles.funcLabel}>{func.example}</div>
                        </div>
                      }
                      arrowPointAtCenter
                    >
                      <div>
                        {t(func.name as any)} <span className={lookupStyles.funcOptLabel}>({func.value})</span>
                      </div>
                    </Tooltip>
                  </Option>
                );
              })}
            </Select>
          </ComponentDisplay>

          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <MobileSelect
              defaultValue={rollUpType || RollUpFuncType.VALUES}
              optionData={getRollUpFunctions().map((func) => {
                return {
                  label: (
                    <>
                      {t(func.name as any)} <span className={lookupStyles.funcOptLabel}>({func.value})</span>
                    </>
                  ),
                  value: func.value,
                };
              })}
              onChange={setFieldProperty('rollUpType')}
              style={{ padding: 0 }}
            />
          </ComponentDisplay>
        </section>
      )}
      {showFormatType === BasicValueType.DateTime && <LookUpFormatDateTime currentField={currentField} setCurrentField={setCurrentField} />}
      {!NOT_FORMAT_FUNC_SET.has(rollUpType as RollUpFuncType) && showFormatType === BasicValueType.Number && (
        <LookUpFormatNumber currentField={currentField} setCurrentField={setCurrentField} />
      )}
    </>
  );
});
