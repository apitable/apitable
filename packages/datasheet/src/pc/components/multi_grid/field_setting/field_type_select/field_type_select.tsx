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
} from '@apitable/core';
import { Tooltip } from 'pc/components/common';
import { useThemeColors } from '@vikadata/components';
import { useCallback, useEffect, useState, useRef } from 'react';
import * as React from 'react';
import HelpIcon from 'static/icon/common/common_icon_information.svg';
import IconArrow from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import styles from '../styles.module.less';
import settingStyles from '../../field_setting/styles.module.less';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { AutoLayout } from '../auto_layout';
import { TypeSelect } from '../../type_select';
import { IField, ISnapshot, Selectors } from '@apitable/core';
import { useSelector } from 'react-redux';
import { store } from 'pc/store';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { useClickAway } from 'ahooks';
import omit from 'lodash/omit';

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

export const FieldTypeSelect: React.FC<IFieldTypeSelectProps> = props => {
  const { setCurrentField, currentField, activeFieldId, activeFieldIndex, snapshot, datasheetId, isMobile, showAdvancedFields } = props;
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const field = useSelector(state => Selectors.getField(state, activeFieldId, snapshot.datasheetId));
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
      setCurrentField(pre => {
        let property = pre.property;

        // 判断是否是在 单选 和 多选 之间相互转换字段，是，则不改变 property 里的值
        const isConvertWithinSelectField = isSelectField({ ...pre, type } as IField) && isSelectField(pre);

        if (!isConvertWithinSelectField) {
          property = getFieldClass(type).defaultProperty();
        }

        // 存在单多选类型切换，进行默认值转换
        if (isConvertWithinSelectField && property.defaultValue != null) {
          property = type === FieldType.MultiSelect ? { ...property, defaultValue: [property.defaultValue] } : omit(property, 'defaultValue');
        }

        const isOtherField2SelectField = field && !isSelectField(field) && isSelectField({ ...field, type } as IField);

        if (isOtherField2SelectField) {
          // 从非 selectField 转换成 selectField ,需要支持预览
          const cellValues = DatasheetActions.getCellValuesByFieldId(store.getState(), snapshot, pre.id);
          const stdVals = cellValues.map(cv => {
            return Field.bindModel(field).cellValueToStdValue(cv as ISegment[]);
          });
          property = Field.bindModel({ ...pre, type, property }).enrichProperty(stdVals);
        }

        return {
          ...pre,
          type,
          property,
        };
      });
      setVisible(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [currentField.type],
  );

  const getFieldHelpLink = () => {
    const helpURL = new URL(FieldTypeDescriptionMap[currentField.type].help);
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
          <a href={getFieldHelpLink()} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
            <HelpIcon style={{ cursor: 'pointer', verticalAlign: '-0.125em', marginLeft: 8 }} fill={colors.thirdLevelText} />
          </a>
        </Tooltip>
      </div>
      <div className={styles.sectionInfo} onClick={onClick} id={DATASHEET_ID.GRID_CUR_COLUMN_TYPE} ref={typeSelectTriggerRef}>
        <div className={settingStyles.iconType}>{getFieldTypeIcon(currentField.type)}</div>
        <div className={styles.text}>{FieldTypeDescriptionMap[currentField.type].title}</div>
        <div className={styles.arrow}>
          <IconArrow width={10} height={10} fill={colors.thirdLevelText} />
        </div>
      </div>
      {visible && (
        <>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div ref={typeSelectPanelRef}>
              <AutoLayout boxWidth={318} datasheetId={datasheetId}>
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
              <Popup visible={visible} onClose={() => setVisible(false)} height="90%" bodyStyle={{ padding: 0 }}>
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
