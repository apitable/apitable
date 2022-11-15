import { Select as SelectBase } from '@apitable/components';
import { useControllableValue } from 'ahooks';

/**
 * Wrapping of component select component, in order not to affect the existing component logic, now wrap a layer here. Support for controllable values
 */
export const Select = (props: {
  value?: any,
  onChange?: (value: any) => void,
  options: any[],
  placeholder?: string,
}) => {
  const [state] = useControllableValue<any>(props);
  const { onChange, options, placeholder } = props;
  const handleChange = (option, index) => {
    // setState(option.value);
    onChange && onChange(option.value);
  };
  return (
    <SelectBase placeholder={placeholder} options={options} value={state} onSelected={handleChange} />
  );
};