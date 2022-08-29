import React from 'react';
import { RadioSpanStyled, RadioInputStyled, RadioInnerStyled, RadioLabelStyled, RadioTextStyled } from './styled';
import cls from 'classnames';
import { RadioGroupContext } from './context';
import { IRadio } from './interface';

export const Radio = React.forwardRef(({
  children,
  name,
  checked,
  onChange,
  readOnly,
  value,
  ...restProps
}: IRadio, ref: React.Ref<HTMLLabelElement>) => {
  const context = React.useContext(RadioGroupContext);
  const handleChange = (e) => {
    onChange?.(e);
    context?.onChange?.(e);
  };
  const disabled = restProps.disabled || context?.disabled;
  const isChecked = context.value === value;
  const isBtn = restProps.isBtn || context?.isBtn;
  const inputProps = {
    name: name || context.name,
    checked: checked || (context.value ? isChecked : undefined),
    disabled,
    onChange: handleChange,
    readOnly,
    value
  };
  return (
    <RadioLabelStyled className={cls({
      'radio-label-btn': isBtn,
      'radio-label-btn-checked': isBtn && isChecked,
      'radio-label-btn-disabled': isBtn && disabled,
    })}>
      <RadioSpanStyled className={cls({
        'radio-btn': isBtn,
        'radio-checked': isChecked,
        'radio-disabled': disabled,
      })}>
        <RadioInputStyled type="radio" {...inputProps} />
        {!isBtn && <RadioInnerStyled className="radio-inner"/>}
      </RadioSpanStyled>
      <RadioTextStyled className="radio-text">
        {children}
      </RadioTextStyled>
    </RadioLabelStyled>
  );
});