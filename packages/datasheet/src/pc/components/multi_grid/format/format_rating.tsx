import { IField, IRatingField, Strings, t } from '@apitable/core';
import ArrowIcon from 'static/icon/common/common_icon_pulldown_line.svg';
import { SelectValue } from 'antd/lib/select';
import { Emoji } from 'pc/components/common';
import { Select, Button, useThemeColors } from '@vikadata/components';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { EMOJI_SIZE } from '../../catalog/tree/tree';
import classNames from 'classnames';
import { EmojiPicker } from 'pc/components/common/emoji_picker';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileSelect } from 'pc/components/common';

interface IFormateRatingProps {
  currentField: IRatingField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormateRating: React.FC<IFormateRatingProps> = (props: IFormateRatingProps) => {
  const colors = useThemeColors();
  const handleMaxChange = ({ value }: { value: SelectValue }) => {
    props.setCurrentField({
      ...props.currentField,
      property: { ...props.currentField.property, max: value as number },
    });
  };

  const options = [...Array(10).keys()].map(item => ({
    value: item + 1,
    label: `${item + 1}`,
  }));

  const onSelect = emoji => {
    props.setCurrentField({
      ...props.currentField,
      property: { ...props.currentField.property, icon: emoji },
    });
  };

  const btnStyle: React.CSSProperties = {
    background: 'none',
  };

  return (
    <div className={classNames(styles.section, 'flex', 'item-center')}>
      <div className={styles.horizontalItem}>
        <div className={styles.horizontalItemTitle}>{t(Strings.icon_setting)}</div>
        <EmojiPicker onSelect={onSelect}>
          <Button style={btnStyle} className={styles.emojiBtn} suffixIcon={<ArrowIcon width={16} height={16} fill={colors.fourthLevelText} />}>
            <Emoji emoji={props.currentField.property.icon} set="apple" size={EMOJI_SIZE} />
          </Button>
        </EmojiPicker>
      </div>
      <div className={styles.horizontalItem}>
        <div className={styles.horizontalItemTitle}>{t(Strings.max_value)}</div>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <Select
            triggerCls={styles.customSelect}
            dropdownMatchSelectWidth={false}
            value={props.currentField.property.max}
            listStyle={{ maxHeight: 350 }}
            onSelected={handleMaxChange}
            options={options}
          />
        </ComponentDisplay>

        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileSelect
            defaultValue={props.currentField.property.max}
            optionData={options}
            onChange={value => handleMaxChange({ value })}
            style={{
              height: 40,
            }}
          />
        </ComponentDisplay>
      </div>
    </div>
  );
};
