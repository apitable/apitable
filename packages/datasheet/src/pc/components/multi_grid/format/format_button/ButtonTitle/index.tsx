import { Input, InputRef } from 'antd';
import { InputProps } from 'antd/lib/input';
import { forwardRef, useState } from 'react';
import * as React from 'react';
import { Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import styles from './style.module.less';

const CONST_MAXMIUM_COUNT = 15;

export type IButtonTitleProps = Omit<InputProps, 'onChange'> &{
    onChange: (value: string) => void
};
export const ButtonTitle =forwardRef<InputRef, IButtonTitleProps >(({ value, onChange, ...rest }, ref) => {

  const [text, setText] = useState(value);

  const colors = useCssColors();

  const hasError = false;
  return (
    <>
      <Input value={text} className={hasError ? 'error': undefined} {...rest} ref={ref}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
      />

      {

        hasError && (
          <Typography variant="body4" color={colors.textDangerDefault} className={styles.errorMsg}>
            {t(Strings.button_maxium_text, {
              count: CONST_MAXMIUM_COUNT
            })}
          </Typography>
        )
      }
    </>
  );
});
