import { ICheckboxField, IField, t, Strings } from '@apitable/core';
import IconArrow from 'static/icon/common/common_icon_pulldown_line.svg';
import { Emoji } from 'pc/components/common';
import { Button, useThemeColors } from '@vikadata/components';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import { EMOJI_SIZE } from '../../catalog/tree/tree';
import styles from './styles.module.less';
import { EmojiPicker } from 'pc/components/common/emoji_picker';
interface IFormateCheckboxProps {
  currentField: ICheckboxField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormateCheckbox: React.FC<IFormateCheckboxProps> = (props: IFormateCheckboxProps) => {

  const { currentField, setCurrentField } = props;
  const colors = useThemeColors();
  const onSelect = emoji => {
    setCurrentField({
      ...currentField,
      property: { ...currentField.property, icon: emoji },
    });
  };

  const TriggerComponent = (
    <Button
      style={{
        height: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'none',
        paddingLeft: 0,
      }}
    >
      <Emoji emoji={currentField.property.icon} set="apple" size={EMOJI_SIZE} />
      <IconArrow width={16} height={16} fill={colors.fourthLevelText} style={{ marginLeft: '4px' }} />
    </Button>
  );

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ margin: 0 }}>{t(Strings.icon_setting)}</div>
      <div className="flex item-center space-between">
        <div style={{ width: '100%' }} >
          <EmojiPicker
            onSelect={onSelect}
          >
            {TriggerComponent}
          </EmojiPicker>
        </div>
      </div>
    </div>
  );
};
