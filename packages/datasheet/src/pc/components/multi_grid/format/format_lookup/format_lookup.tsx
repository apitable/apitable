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

import { Select, TextButton, useThemeColors, RadioGroup, Radio } from '@apitable/components';
import {
  BasicValueType, ConfigConstant, DateTimeField, Field, FieldType, Functions, IField, 
  IFilterInfo, ILookUpField, ILookUpProperty, IViewColumn, LookUpField,
  NOT_FORMAT_FUNC_SET, RollUpFuncType, Selectors, StringKeysType, Strings, t, LookUpLimitType, ISortInfo
} from '@apitable/core';
import { ChevronRightOutlined, WarnCircleFilled, QuestionCircleOutlined } from '@apitable/icons';
import { Switch } from 'antd';
import classNames from 'classnames';
import { Message, MobileSelect, Modal, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { InlineNodeName } from 'pc/components/common/inline_node_name';
import { FilterModal } from 'pc/components/multi_grid/format/format_lookup/filter_modal/filter_modal';
import { TComponent } from 'pc/components/common/t_component';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { LinkFieldPanel } from 'pc/components/multi_grid/format/format_lookup/link_field_panel';
import { LookupFieldPanel } from 'pc/components/multi_grid/format/format_lookup/look_field_panel';
import { store } from 'pc/store';
import * as React from 'react';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isNumber } from 'util';
import { getFieldTypeIcon } from '../../field_setting';
import settingStyles from '../../field_setting/styles.module.less';
import styles from '../styles.module.less';
import { MyTrigger } from '../trigger';
import { LookUpFormatDateTime } from './lookup_format_datetime';
import { LookUpFormatNumber } from './lookup_format_number';
import lookupStyles from './styles.module.less';

const Option = Select.Option;

interface IFormateLookUpProps {
  currentField: ILookUpField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  datasheetId?: string;
}

interface IRollUpFunction {
  value: string;
  name: StringKeysType;
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
  const activeDstId = useSelector(state => datasheetId || Selectors.getActiveDatasheetId(state))!;
  const { relatedLinkFieldId, lookUpTargetFieldId, rollUpType, filterInfo, openFilter = false, sortInfo, lookUpLimit } = currentField.property;
  const linkFields = Field.bindModel(currentField).getLinkFields();
  const relatedLinkField = Field.bindModel(currentField).getRelatedLinkField();
  const { error: isFilterError, typeSwitch: isFilterTypeSwitch } = Field.bindModel(currentField).checkFilterInfo();
  const [showDatasheetPanel, setShowDatasheetPanel] = useState(false);
  const [showTargetFieldPanel, setShowTargetFieldPanel] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const foreignDatasheetFieldMap = useSelector(
    state => relatedLinkField && Selectors.getFieldMap(state, relatedLinkField.property.foreignDatasheetId),
  );
  const foreignDatasheetActiveView = useSelector(state => {
    return relatedLinkField && Selectors.getCurrentView(state, relatedLinkField.property.foreignDatasheetId);
  });
  const foreignDatasheetReadable = useSelector(state => Selectors.getPermissions(state, relatedLinkField?.property.foreignDatasheetId).readable);
  const foreignFieldPermissionMap = useSelector(state => Selectors.getFieldPermissionMap(state, relatedLinkField?.property.foreignDatasheetId));

  const foreignDatasheetFields =
    foreignDatasheetFieldMap && foreignDatasheetActiveView && foreignDatasheetReadable
      ? (foreignDatasheetActiveView.columns as IViewColumn[]).map(column => {
        return foreignDatasheetFieldMap[column.fieldId];
      })
      : [];

  const lookUpField = foreignDatasheetFieldMap && foreignDatasheetFieldMap[lookUpTargetFieldId];
  const isCryptoLookField = Selectors.getFieldRoleByFieldId(foreignFieldPermissionMap, lookUpTargetFieldId) === ConfigConstant.Role.None;

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
      .filter(item => !isNumber(item))
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
      .filter(i => Boolean(i)) as IRollUpFunction[];
  };

  const setFieldProperty = (propertyKey: keyof ILookUpProperty) => (value: any) => {
    if (currentField.property[propertyKey] !== value) {
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
        console.log('newField', newField);
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
          onOk: () => updateField({ openFilter: false, filterInfo: undefined }),
        });
      } else if (
        // Closing the filter button will cause the filter data to be cleared, giving a prompt
        propertyKey === 'openFilter' &&
        openFilter &&
        Boolean(filterInfo && filterInfo.conditions.length > 0)
      ) {
        Modal.confirm({
          title: t(Strings.operate_info),
          content: t(Strings.comfirm_close_filter_switch),
          okText: t(Strings.submit),
          cancelText: t(Strings.give_up_edit),
          onOk: () => updateField({ filterInfo: undefined }),
        });
      } else if(propertyKey === 'sortInfo' && openFilter) {
        updateField();
      } else {
        console.log('updateField', value);
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

  const LookupFieldTrigger = () => {
    const renderInner = () => {
      if (lookUpTargetFieldId && lookUpField) {
        return (
          <div className={lookupStyles.fieldIconAndTitle}>
            <div className={lookupStyles.iconType}>{getFieldTypeIcon(lookUpField.type)}</div>
            <div className={lookupStyles.fieldName}>{lookUpField.name}</div>
          </div>
        );
      }
      if (isCryptoLookField) {
        return (
          <span className={lookupStyles.cryptoLinkField}>
            <FieldPermissionLock isLock />
            {t(Strings.crypto_field)}
          </span>
        );
      }
      return <span className={lookupStyles.plzSelectFieldText}>{t(Strings.check_field)}</span>;
    };
    return (
      <div className={settingStyles.sectionInfo}>
        <div className={classNames(settingStyles.text)}>{renderInner()}</div>
        <div className={settingStyles.arrow}>
          <ChevronRightOutlined size={10} color={colors.thirdLevelText} />
        </div>
      </div>
    );
  };

  return (
    <>
      <section className={settingStyles.section}>
        <div className={settingStyles.sectionTitle}>
          {t(Strings.rollup_choose_table)}
          <Tooltip title={t(Strings.rollup_choose_table_description)} trigger={'hover'}>
            <a 
              href=''
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'inline-block', cursor: 'pointer', verticalAlign: '-0.25em', marginLeft: 8 }}
            >
              <QuestionCircleOutlined size={16} color={colors.thirdLevelText} />
            </a>
          </Tooltip>
        </div>
        <MyTrigger
          showPopup={showDatasheetPanel}
          setShowPopup={setShowDatasheetPanel}
          popupAlign={popupAlign}
          popup={
            <LinkFieldPanel
              fields={linkFields}
              activeFieldId={relatedLinkFieldId}
              setSearchPanelVisible={setShowDatasheetPanel}
              onChange={setFieldProperty('relatedLinkFieldId')}
            />
          }
          trigger={
            <div className={relatedLinkFieldId && relatedLinkField ? settingStyles.sectionMultiInfo : settingStyles.sectionInfo}>
              <div className={classNames(settingStyles.text, lookupStyles.fieldItem)}>
                {relatedLinkFieldId && relatedLinkField ? (
                  <div>
                    <div className={lookupStyles.fieldIconAndTitle}>
                      <div className={lookupStyles.iconType}>{getFieldTypeIcon(relatedLinkField.type)}</div>
                      <div className={lookupStyles.fieldName}>{relatedLinkField.name}</div>
                    </div>
                    <div className={lookupStyles.relatedSheetName}>
                      {renderInlineNodeName(t(Strings.association_table), relatedLinkField.property.foreignDatasheetId)}
                    </div>
                  </div>
                ) : (
                  <span className={lookupStyles.plzSelectFieldText}>{t(Strings.lookup_link)}</span>
                )}
              </div>
              <div className={settingStyles.arrow}>
                <ChevronRightOutlined size={10} color={colors.thirdLevelText} />
              </div>
            </div>
          }
        />

        {linkFields.length === 0 && (
          <span className={lookupStyles.warningText}>
            <WarnCircleFilled color={colors.thirdLevelText} size={12} /> {t(Strings.table_link_err)}
          </span>
        )}
      </section>
      {relatedLinkFieldId && relatedLinkField && (
        <section className={classNames(settingStyles.section, styles.border)} style={{ marginBottom: 8 }}>
          <div className={classNames(settingStyles.sectionTitle, settingStyles.flex)} style={{ marginBottom: 4 }}>
            <TComponent
              tkey={t(Strings.from_select_link_column)}
              params={{
                name: renderInlineNodeName('', relatedLinkField.property.foreignDatasheetId, { maxWidth: '90px' }),
              }}
            />
          </div>
          <MyTrigger
            popupVisibleCheck={handleForeignDstReadable}
            trigger={LookupFieldTrigger()}
            popup={
              <LookupFieldPanel
                fields={foreignDatasheetFields}
                field={currentField}
                activeFieldId={lookUpTargetFieldId}
                setSearchPanelVisible={setShowTargetFieldPanel}
                onChange={setFieldProperty('lookUpTargetFieldId')}
                relatedLinkField={relatedLinkField}
              />
            }
            popupAlign={popupAlign}
            showPopup={showTargetFieldPanel}
            setShowPopup={setShowTargetFieldPanel}
          />
          <div className={classNames(settingStyles.sectionTitle, settingStyles.enhance)}>
            <Switch
              size='small'
              onChange={() => {
                const isForeignDstReadable = handleForeignDstReadable();
                isForeignDstReadable && setFieldProperty('openFilter')(!openFilter);
              }}
              checked={openFilter}
            />
            {t(Strings.rollup_filter_sort)}
          </div>
          {openFilter &&
            (!isFilterError ? (
              <div
                className={settingStyles.sectionInfo}
                onClick={() => {
                  const isForeignDstReadable = handleForeignDstReadable();
                  console.log('isForeignDstReadable', isForeignDstReadable);
                  isForeignDstReadable && setFilterModal(true);
                }}
              >
                {isFilterTypeSwitch && (
                  <Tooltip title={t(Strings.loopkup_filter_pane_tip)} placement='top'>
                    <WarnCircleFilled color={colors.warningColor} size={16} className={settingStyles.warningIcon} />
                  </Tooltip>
                )}
                <div className={classNames(settingStyles.text)}>
                  <span>
                    {(!filterInfo?.conditions.length && !sortInfo?.rules.length)
                      ? t(Strings.add_filter)
                      : t(Strings.rollup_conditions_num, {
                        FILTER_NUM: filterInfo?.conditions.length || 0,
                        ORDER_BY_NUM: sortInfo?.rules.length || 0
                      })}
                  </span>
                </div>
                <div className={settingStyles.arrow}>
                  <ChevronRightOutlined size={10} color={colors.thirdLevelText} />
                </div>
              </div>
            ) : (
              <div className={settingStyles.sectionClear}>
                <div>
                  <WarnCircleFilled color={colors.warningColor} size={16} className={settingStyles.warningIcon} />
                  {t(Strings.filter_delete_tip)}
                </div>
                <TextButton color='danger' size='small' onClick={() => setFieldProperty('filterInfo')(undefined)}>
                  {t(Strings.clear)}
                </TextButton>
              </div>
            ))}
          <div className={settingStyles.limitSelect}>
            <div className={settingStyles.sectionTitle}>{t(Strings.rollup_limit)}</div> 
            <ComponentDisplay minWidthCompatible={ScreenSize.md}>
              <Select
                value={lookUpLimit || LookUpLimitType.ALL}
                onSelected={({ value }) => {
                  setFieldProperty('lookUpLimit')(value);
                }}
              >
                <Option value={LookUpLimitType.FIRST} key={LookUpLimitType.FIRST} currentIndex={0}>{t(Strings.rollup_limit_option_2)}</Option>
                <Option value={LookUpLimitType.ALL} key={LookUpLimitType.ALL} currentIndex={1}>{t(Strings.rollup_limit_option_1)}</Option>
              </Select>
            </ComponentDisplay>
            <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
              <RadioGroup 
                name="btn-group-with-default" 
                isBtn value={lookUpLimit || LookUpLimitType.ALL} 
                block 
                onChange={(_e, value) => {
                  setFieldProperty('lookUpLimit')(value);
                }}>
                <Radio value={LookUpLimitType.FIRST}>{t(Strings.rollup_limit_option_2)}</Radio>
                <Radio value={LookUpLimitType.ALL}>{t(Strings.rollup_limit_option_1)}</Radio>
              </RadioGroup>
            </ComponentDisplay>
          </div>
          { filterModal &&
            <FilterModal
              filterModalVisible={filterModal}
              field={currentField}
              handleCancel={() => setFilterModal(false)}
              datasheetId={relatedLinkField.property.foreignDatasheetId}
              filterInfo={filterInfo}
              sortInfo={sortInfo}
              handleOk={(filterInfo: IFilterInfo, sortInfo: ISortInfo) => { 
                setFieldProperty('filterInfo')(filterInfo); 
                setFieldProperty('sortInfo')(sortInfo);
              }}
            />
          }
        </section>
      )}
      {Boolean(relatedLinkFieldId && lookUpTargetFieldId) && (
        <section className={classNames(settingStyles.section, styles.border)}>
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
                      placement='left'
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
              optionData={getRollUpFunctions().map(func => {
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
