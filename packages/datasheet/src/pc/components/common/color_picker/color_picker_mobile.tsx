import { Strings, t } from '@apitable/core';
import * as React from 'react';
import { ColorPickerPane, IColorPickerPane } from './color_picker_pane';
import { stopPropagation } from 'pc/utils';
import { Popup } from '../mobile/popup';

interface IColorPickerMobileProps extends IColorPickerPane {
  visible: boolean;
}

export const ColorPickerMobile: React.FC<IColorPickerMobileProps> = props => {
  const {
    visible,
    ...rest
  } = props;

  return (
    <Popup
      title={t(Strings.please_choose)}
      height='auto'
      open={visible}
      onClose={e => {
        stopPropagation(e as any);
        props.onClose();
      }}
      destroyOnClose
    >
      <ColorPickerPane
        {...rest}
      />
    </Popup>
  );
};
