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
import omit from 'lodash/omit';
import { useCallback, useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import {
  DATASHEET_ID,
  Field,
  FieldType,
  FieldTypeDescriptionMap,
  getFieldClass,
  ISegment,
  SelectField,
  Strings,
  t,
  DatasheetActions,
  IField,
  ISnapshot,
  Selectors,
} from '@apitable/core';
import { QuestionCircleOutlined, ChevronRightOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { TypeSelect } from '../../type_select';
import { AutoLayout } from '../auto_layout';
import styles from '../styles.module.less';

interface IFieldTypeSelectProps {
  currentField: IField;
  setCurrentField: React.Dispatch<React.SetStateAction<IField>>;
  activeFieldId: string;
  activeFieldIndex: number;
  snapshot: ISnapshot;
  datasheetId?: string;
  isMobile?: boolean;
  showAdvancedFields?: boolean;
}

function isSelectField(field: IField) {
  return Field.bindModel(field) instanceof SelectField;
}

export const FieldTypeSelect: React.FC<React.PropsWithChildren<IFieldTypeSelectProps>> = (props) => {
  const { setCurrentField, currentField, activeFieldId, activeFieldIndex, snapshot, datasheetId, isMobile, showAdvancedFields } = props;
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const field = useAppSelector((state) => Selectors.getField(state, activeFieldId, snapshot.datasheetId));
  const typeSelectTriggerRef = useRef<HTMLDivElement>(null);
  const typeSelectPanelRef = useRef<HTMLDivElement>(null);
  useClickAway(() => {
    setVisible(false);
  }, [typeSelectTriggerRef, typeSelectPanelRef]);

  useEffect(() => {
    setVisible(false);
  }, [activeFieldId]);

  const onTypeSelectClick = useCallback(
    (type: FieldType) => {
      if (type === currentField.type) {
        return setVisible(false);
      }
      setCurrentField((pre: IField) => {
        let property = pre.property;

        // Determines whether the fields are converted between single and multiple choice, and if so, does not change the value in the property
        const isConvertWithinSelectField = isSelectField({ ...pre, type } as IField) && isSelectField(pre);

        if (!isConvertWithinSelectField) {
          property = getFieldClass(type).defaultProperty();
        }

        // Presence of single multi-select type switching for default value conversion
        if (isConvertWithinSelectField && property.defaultValue != null) {
          property = type === FieldType.MultiSelect ? { ...property, defaultValue: [property.defaultValue] } : omit(property, 'defaultValue');
        }

        const isOtherField2SelectField = field && !isSelectField(field) && isSelectField({ ...field, type } as IField);

        if (isOtherField2SelectField) {
          // Convert from non-selectField to selectField ,need to support preview
          const cellValues = DatasheetActions.getCellValuesByFieldId(store.getState(), snapshot, pre.id);
          const stdVals = cellValues.map((cv) => {
            return Field.bindModel(field).cellValueToStdValue(cv as ISegment[]);
          });
          property = Field.bindModel({ ...pre, type, property } as IField).enrichProperty(stdVals);
        }

        return {
          ...pre,
          type,
          property,
        } as IField;
      });
      setVisible(false);
    },
    // eslint-disable-next-line
    [currentField.type],
  );

  const getFieldHelpLink = () => {
    const help = FieldTypeDescriptionMap[currentField.type].help;
    if (!help) return '';
    const helpURL = new URL(help);
    return helpURL.toString();
  };

  const onClick = () => {
    if (isMobile) {
      setVisible(true);
    } else {
      setVisible(!visible);
    }
  };

  return (
    <section className={styles.section} style={{ marginBottom: 8 }}>
      <div className={styles.sectionTitle}>
        {t(Strings.field_type)}
        <Tooltip title={t(Strings.click_to_view_instructions)} trigger={'hover'}>
          <a
            href={getFieldHelpLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', cursor: 'pointer', verticalAlign: '-0.25em', marginLeft: 8 }}
          >
            <QuestionCircleOutlined size={16} color={colors.thirdLevelText} />
          </a>
        </Tooltip>
      </div>
      <div className={styles.sectionInfo} onClick={onClick} id={DATASHEET_ID.GRID_CUR_COLUMN_TYPE} ref={typeSelectTriggerRef}>
        <div className={styles.iconType}>{getFieldTypeIcon(currentField.type)}</div>
        <div className={styles.text}>{FieldTypeDescriptionMap[currentField.type].title}</div>
        <div className={styles.arrow}>
          <ChevronRightOutlined size={16} color={colors.thirdLevelText} />
        </div>
      </div>
      {visible && (
        <>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div ref={typeSelectPanelRef}>
              <AutoLayout boxWidth={226} datasheetId={datasheetId}>
                <TypeSelect
                  onClick={onTypeSelectClick}
                  currentFieldType={currentField.type}
                  fieldIndex={activeFieldIndex}
                  showAdvancedFields={showAdvancedFields}
                />
              </AutoLayout>
            </div>
          </ComponentDisplay>

          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            {visible && (
              <Popup title={t(Strings.select_one_field)} open={visible} onClose={() => setVisible(false)} height="90%" bodyStyle={{ padding: 0 }}>
                <TypeSelect
                  onClick={onTypeSelectClick}
                  currentFieldType={currentField.type}
                  fieldIndex={activeFieldIndex}
                  showAdvancedFields={showAdvancedFields}
                />
              </Popup>
            )}
          </ComponentDisplay>
        </>
      )}
    </section>
  );
};
