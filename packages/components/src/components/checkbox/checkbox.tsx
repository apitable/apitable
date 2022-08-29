import { SelectOutlined } from '@vikadata/icons';
import { useKeyPress } from 'ahooks';
import React, { useRef, useState } from 'react';
import { CheckboxIconWrapper, CheckboxWrapper } from './styled';
import { ICheckboxProps } from './interface';
import { useProviderTheme } from 'hooks';

export const Checkbox: React.FC<ICheckboxProps> = ({
  size = 16, onChange, color, disabled, checked: _checked, children
}) => {
  const checkboxRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(Boolean(_checked));
  const theme = useProviderTheme();
  const { blackBlue } = theme.color;
  const handleClick = () => {
    if (!disabled) {
      setChecked(!checked);
      onChange && onChange(!checked);
    }
  };
  useKeyPress(
    'Space',
    (e: Event) => {
      handleClick();
      e.preventDefault();
    },
    { target: checkboxRef }
  );

  return (
    <CheckboxWrapper
      onClick={handleClick}
      aria-checked={checked}
      disabled={disabled}
      checked={checked}
      color={color}
    >
      <CheckboxIconWrapper
        size={size}
        checked={checked}
        color={color}
        tabIndex={0}
        role="checkbox"
        ref={checkboxRef}
        disabled={disabled}
      >
        {
          checked && <SelectOutlined size={size * 0.75} color={blackBlue[50]} />
        }
      </CheckboxIconWrapper>
      {children && <span style={{ paddingLeft: 4 }}>{children}</span>}
    </CheckboxWrapper>
  );
};
