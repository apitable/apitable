import { WidgetProps } from '@rjsf/core';
import { Checkbox } from '@apitable/components';

const selectValue = (value: any, selected: any, all: any) => {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
};

const deselectValue = (value: any, selected: any) => {
  return selected.filter((v: any) => v !== value);
};

export const CheckboxesWidget = ({
  schema,
  label,
  id,
  disabled,
  options,
  value,
  autofocus,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  const { enumOptions, enumDisabled } = options;

  const _onChange = (option: any, checked: boolean) => {
    const all = (enumOptions as any).map(({ value }: any) => value);
    if (checked) {
      onChange(selectValue(option.value, value, all));
    } else {
      onChange(deselectValue(option.value, value));
    }
  };
  return (
    <>
      {(enumOptions as any).map((option: any, index: number) => {
        const checked = value.indexOf(option.value) !== -1;
        const itemDisabled = Boolean(enumDisabled && (enumDisabled as any).indexOf(option.value) !== -1);
        return (
          <div key={`${id}_${index}`} style={{ display: 'flex' }}>
            <Checkbox
              checked={checked}
              disabled={itemDisabled}
              onChange={(value) => _onChange(option, value)}
            >
              {option.label}
            </Checkbox>
          </div>
        );
      })}
    </>
  );
};