import { Input, InputRef } from 'antd';
import { InputProps } from 'antd/lib/input';
import { forwardRef, useState } from 'react';
import * as React from 'react';
import { Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import style from 'pc/components/automation/content/basic_info/styles.module.less';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import styles from './style.module.less';

const CONST_MAXMIUM_COUNT = 15;

export type IButtonTitleProps = Omit<InputProps, 'onChange'> &{
    onChange: (value: string) => void
};
export const ButtonTitle =forwardRef<InputRef, IButtonTitleProps >(({ value, onChange, ...rest }, ref) => {

  const [text, setText] = useState(value);

  const colors = useCssColors();

  let hasError = false;
  if(text) {
    hasError = String(text)?.length > CONST_MAXMIUM_COUNT ;
  }
  return (
    <>
      <Input value={text} className={hasError ? 'error': undefined} {...rest} ref={ref}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.slice(0, CONST_MAXMIUM_COUNT));
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
