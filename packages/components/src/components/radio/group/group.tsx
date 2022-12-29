import React from 'react';
import { RadioGroupContext } from '../context';
import { IRadioGroup } from './interface';
import { RadioGroupStyled } from './styled';
import { Radio } from '../radio';

export const RadioGroup = React.forwardRef(({
  children,
  name,
  disabled,
  onChange,
  options,
  ...restProps
}: IRadioGroup, ref: React.Ref<HTMLLabelElement>) => {
  const [value, setValue] = React.useState(() => restProps.value);
  const handleChange = (event) => {
    const targetValue = event.target.value;
    setValue(targetValue);
    if (onChange) {
      onChange(event, targetValue);
    }
  };
  return (
    <RadioGroupContext.Provider value={{ name, disabled, onChange: handleChange, value, isBtn: restProps.isBtn }}>
      <RadioGroupStyled {...restProps}>
        {options ? options.map((option, idx) => {
          const { label, ...restOption } = option;
          return (
            <Radio key={idx} {...restOption}>{label}</Radio>
          );
        }) : children}
      </RadioGroupStyled>
    </RadioGroupContext.Provider>
  );
});