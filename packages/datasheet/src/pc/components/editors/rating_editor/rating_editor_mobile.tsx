import { ConfigConstant } from '@vikadata/core';
import { Rate } from 'pc/components/common/rate';
import { memo } from 'react';
import * as React from 'react';
import style from './style.module.less';
import { Emoji } from 'pc/components/common/emoji';
import IconArrow from 'static/icon/common/common_icon_pulldown_line.svg';
import { useThemeColors } from '@vikadata/components';
import { useState } from 'react';
import { RateItem } from './rate_item';
import { t } from '@vikadata/core';
import { Strings } from '@vikadata/core';
import { Popup } from 'pc/components/common/mobile/popup';
import classNames from 'classnames';

export interface IRatingEditorMobileProps {
  editable: boolean;
  editing: boolean;
  max: number;
  value: number | null;
  onChange(value: number): void;
  emoji: any;
  filtering?: boolean;
}

const RatingEditorMobileBase: React.FC<IRatingEditorMobileProps> = props => {
  const {
    editable,
    max,
    value,
    editing,
    emoji,
    onChange,
    filtering,
  } = props;
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        className={classNames(style.editorContent, filtering && style.filtering)}
        onClick={() => setVisible(!visible)}
      >
        <Rate
          disabled={!editable}
          value={value}
          character={<Emoji emoji={emoji} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />}
          max={max}
        />
        {editable && <IconArrow width={16} height={16} fill={colors.fourthLevelText} />}
      </div>
      {visible && editable && <Popup
        title={t(Strings.please_choose)}
        height={'50%'}
        visible={visible && editing}
        onClose={() => setVisible(false)}
        className={style.ratingEditorPopupWrapper}
      >
        <div className={style.rateItemList}>
          {[...Array(max + 1).keys()].map((item, index) => (
            <RateItem
              onChange={value => {
                onChange(value);
                setVisible(false);
              }}
              value={index}
              checked={value === index}
            >
              <Emoji emoji={emoji} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />
            </RateItem>
          ))}
        </div>
      </Popup>}
    </>
  );
};

export const RatingEditorMobile = memo((RatingEditorMobileBase));
