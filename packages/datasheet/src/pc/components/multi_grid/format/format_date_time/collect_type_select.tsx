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

import { useClickAway } from 'ahooks';
import RcTrigger from 'rc-trigger';
import { memo, useState, useMemo, useRef } from 'react';
import { TextButton, useThemeColors } from '@apitable/components';
import { CollectType, Selectors, Strings, t, ILastModifiedByField, ILastModifiedTimeField } from '@apitable/core';
import { EditOutlined } from '@apitable/icons';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useAppSelector } from 'pc/store/react-redux';
import IconArrow from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import { AutoLayout } from '../../field_setting/auto_layout';
import settingStyles from '../../field_setting/styles.module.less';
import styles from './styles.module.less';

interface ICollectTypeSelectProps {
  field: ILastModifiedTimeField | ILastModifiedByField;
  onChange: (type: CollectType) => void;
}

export const CollectTypeSelect = memo((props: ICollectTypeSelectProps) => {
  const colors = useThemeColors();
  const { onChange, field: currentField } = props;
  const { collectType, fieldIdCollection } = currentField.property;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const [visible, setVisible] = useState(false);
  const collectTypeOptions = useMemo(
    () => [
      { type: CollectType.AllFields, name: t(Strings.all_editable_fields) },
      { type: CollectType.SpecifiedFields, name: t(Strings.specified_fields) },
    ],
    [],
  );
  const colletTypeSelectRef = useRef<HTMLDivElement>(null);
  useClickAway(() => {
    setVisible(false);
  }, colletTypeSelectRef);

  const handleClick = () => {
    setVisible(!visible);
  };

  const onSelectItemClick = (value: CollectType) => {
    setVisible(false);
    onChange(value);
  };

  const renderAutoLayout = () => {
    return (
      <RcTrigger
        action={'click'}
        popup={
          <AutoLayout boxWidth={280}>
            <div className={styles.viewSelectPanel}>
              <div className={styles.viewSelect}>
                {collectTypeOptions.map((option) => {
                  return (
                    <div key={option.type} className={styles.viewSelectItem} onClick={() => onSelectItemClick(option.type)}>
                      {option.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </AutoLayout>
        }
        destroyPopupOnHide
        popupAlign={{
          points: ['tr', 'tl'],
          offset: [0, -20],
          overflow: { adjustX: true },
        }}
        popupStyle={{ width: 280, background: colors.defaultBg }}
        popupVisible={visible}
        zIndex={100}
      >
        <span />
      </RcTrigger>
    );
  };

  const optionData = collectTypeOptions.map((option) => ({
    value: option.type,
    label: option.name,
  }));

  const SelectedFieldItem = ({ fieldId }: { fieldId: string }) => {
    if (!fieldMap[fieldId]) {
      return <></>;
    }
    return (
      <div key={fieldId} className={styles.selectedFiledItem}>
        <div className={styles.selectedFieldIconAndTitle}>
          <div className={styles.iconType}>{getFieldTypeIcon(fieldMap[fieldId].type)}</div>
          <div className={styles.fieldName}>{fieldMap[fieldId].name}</div>
        </div>
      </div>
    );
  };

  const SelectedFieldList = () => {
    if (!fieldIdCollection.length) {
      return null;
    }
    return (
      <>
        <div className={styles.selectedFieldList}>
          {fieldIdCollection.map((fieldId) => (
            <SelectedFieldItem fieldId={fieldId} key={fieldId} />
          ))}
        </div>
        <div className={styles.editField}>
          <TextButton className={styles.editBtn} onClick={() => onChange(CollectType.SpecifiedFields)}>
            <EditOutlined size={16} color={colors.thirdLevelText} />
            <span className={styles.editText}>{t(Strings.edit_selected_field)}</span>
          </TextButton>
        </div>
      </>
    );
  };

  const displayName = useMemo(() => {
    return collectTypeOptions.find((v) => v.type === collectType)!.name;
  }, [collectTypeOptions, collectType]);

  const TriggerComponent = (
    <>
      <div className={settingStyles.text}>{displayName}</div>
      <div className={settingStyles.arrow}>
        <IconArrow width={10} height={10} fill={colors.thirdLevelText} />
      </div>
    </>
  );

  return (
    <section className={settingStyles.section}>
      <div className={settingStyles.sectionTitle}>{t(Strings.field_range)}</div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={settingStyles.sectionInfo} onClick={handleClick} ref={colletTypeSelectRef}>
          {TriggerComponent}
          {renderAutoLayout()}
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileSelect
          title={t(Strings.please_choose)}
          height="auto"
          triggerComponent={<div className={settingStyles.sectionInfo}>{TriggerComponent}</div>}
          optionData={optionData}
          onChange={onSelectItemClick}
        />
      </ComponentDisplay>
      {collectType === CollectType.SpecifiedFields && SelectedFieldList()}
    </section>
  );
});
