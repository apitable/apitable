import { Select as SelectBase } from '@vikadata/components';
import { useControllableValue } from 'ahooks';

/**
 * 对 component select 组件的封装，为了不影响现有组件逻辑，现在这里包一层。支持可控值
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