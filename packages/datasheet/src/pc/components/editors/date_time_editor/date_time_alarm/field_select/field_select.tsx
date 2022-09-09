import { FieldType, IFieldMap, Strings, t } from '@vikadata/core';
import { ChevronDownOutlined } from '@vikadata/icons';
import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { FieldList } from 'pc/components/editors/date_time_editor/date_time_alarm/field_select/field_list';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { colorVars } from '@vikadata/components';
import Trigger from 'rc-trigger';
import { useMemo, useRef, useState } from 'react';
import * as React from 'react';
import IconArrow from 'static/icon/common/common_icon_pulldown_line.svg';
import styles from './style.module.less';

interface IFieldSelectProps {
  selectedFieldIds: string[];
  fieldMap: IFieldMap;
  onChange(ids: string[]): void;
}

export const FieldSelect: React.FC<IFieldSelectProps> = props => {
  const { selectedFieldIds, fieldMap, onChange } = props;

  const [visible, setVisible] = useState(false);

  const listData = useMemo(() => {
    return Object.values(fieldMap).filter(field => field.type === FieldType.Member);
  }, [fieldMap]);

  // TODO 解决神奇引用筛选面板不关闭问题，临时解决方案，强行关闭
  const refSelect = useRef<HTMLDivElement>(null);
  const refSelectItem = useRef<HTMLDivElement>(null);

  useClickAway(() => setVisible(false), [refSelect, refSelectItem], 'click');

  const renderPopup = () => {
    return (
      <div ref={refSelectItem}>
        <FieldList fields={listData} selectedFieldIds={selectedFieldIds} onChange={onChange} />
      </div>
    );
  };

  const selectedFieldsValue = (
    <div className={styles.selectedFieldsValue}>
      {selectedFieldIds.map(fieldId => {
        const field = fieldMap[fieldId];
        return (
          <div className={styles.value} key={fieldId}>
            <span className={styles.icon}>{getFieldTypeIcon(field.type, colorVars.thirdLevelText)}</span>
            {field.name}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.select} ref={refSelect}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Trigger
          action={['click']}
          popup={renderPopup()}
          destroyPopupOnHide
          popupAlign={{ points: ['tl', 'bl'], offset: [0, 8], overflow: { adjustX: true, adjustY: true }}}
          popupVisible={visible}
          onPopupVisibleChange={visible => setVisible(visible)}
          stretch="width,height"
          popupStyle={{ width: 248, height: 'max-content' }}
        >
          <div className={classNames(styles.displayBox, styles.option)}>
            {selectedFieldsValue}
            <div className={styles.iconArrow} style={{ transform: `rotate(${visible ? '180deg' : 0})` }}>
              <ChevronDownOutlined color={colorVars.black[500]} />
            </div>
          </div>
        </Trigger>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={classNames(styles.displayBox, styles.option)} onClick={() => setVisible(!visible)}>
          {selectedFieldsValue}
          <div className={styles.iconArrow}>
            <IconArrow width={16} height={16} fill={colorVars.fourthLevelText} />
          </div>
        </div>
        <Popup
          title={t(Strings.please_choose)}
          height="90%"
          visible={visible}
          onClose={() => setVisible(false)}
          className={styles.filterGeneralPopupWrapper}
        >
          {renderPopup()}
        </Popup>
      </ComponentDisplay>
    </div>
  );
};
