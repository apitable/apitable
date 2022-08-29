import { memo, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CollectType, Selectors, Strings, t, ILastModifiedByField, ILastModifiedTimeField } from '@vikadata/core';
import settingStyles from '../../field_setting/styles.module.less';
import styles from './styles.module.less';
import { AutoLayout } from '../../field_setting/auto_layout';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import IconArrow from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import IconEdit from 'static/icon/datasheet/rightclick/datasheet_icon_rename.svg';
import { TextButton, useThemeColors } from '@vikadata/components';
import RcTrigger from 'rc-trigger';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { MobileSelect } from 'pc/components/common';
import { useClickAway } from 'ahooks';

interface ICollectTypeSelectProps {
  field: ILastModifiedTimeField | ILastModifiedByField;
  onChange: (type: CollectType) => void;
}

export const CollectTypeSelect = memo((props: ICollectTypeSelectProps) => {
  const colors = useThemeColors();
  const { onChange, field: currentField } = props;
  const { collectType, fieldIdCollection } = currentField.property;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const [visible, setVisible] = useState(false);
  const collectTypeOptions = useMemo(() => ([
    { type: CollectType.AllFields, name: t(Strings.all_editable_fields) },
    { type: CollectType.SpecifiedFields, name: t(Strings.specified_fields) },
  ]), []);
  const colletTypeSelectRef = useRef<HTMLDivElement>(null);
  useClickAway(() => { setVisible(false); }, colletTypeSelectRef);

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
                {collectTypeOptions.map(option => {
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

  const optionData = collectTypeOptions.map(option => ({
    value: option.type,
    label: option.name,
  }));

  const SelectedFieldItem = ({ fieldId }) => {
    if (!fieldMap[fieldId]) {
      return <></>;
    }
    return (
      <div key={fieldId} className={styles.selectedFiledItem}>
        <div className={styles.selectedFieldIconAndTitle}>
          <div className={styles.iconType}>
            {getFieldTypeIcon(fieldMap[fieldId].type)}
          </div>
          <div className={styles.fieldName}>
            {fieldMap[fieldId].name}
          </div>
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
          {
            fieldIdCollection.map(
              fieldId => <SelectedFieldItem fieldId={fieldId} key={fieldId} />,
            )
          }
        </div>
        <div className={styles.editField}>
          <TextButton
            className={styles.editBtn}
            onClick={() => onChange(CollectType.SpecifiedFields)}
          >
            <IconEdit width={16} height={16} fill={colors.thirdLevelText} />
            <span className={styles.editText}>{t(Strings.edit_selected_field)}</span>
          </TextButton>
        </div>
      </>
    );
  };

  const displayName = useMemo(() => {
    return collectTypeOptions.find(v => v.type === collectType)!.name;
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
          {
            renderAutoLayout()
          }
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileSelect
          title={t(Strings.please_choose)}
          height="auto"
          triggerComponent={(
            <div className={settingStyles.sectionInfo}>
              {TriggerComponent}
            </div>
          )}
          optionData={optionData}
          onChange={onSelectItemClick}
        />
      </ComponentDisplay>
      {collectType === CollectType.SpecifiedFields && SelectedFieldList()}
    </section>
  );
});
