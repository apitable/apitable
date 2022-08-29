import { Box, Switch } from '@vikadata/components';
import { IWidgetProps } from '../../interface';

export const SwitchWidget = (props: IWidgetProps) => {
  const {
    schema,
    id,
    value,
    disabled,
    readonly,
    label,
    onBlur,
    onFocus,
    onChange,
  } = props;

  // const required = schemaRequiresTrueValue(schema);
  const shouldDisabled = disabled || readonly;
  return (
    <Box
      display="flex"
      style={{ cursor: 'pointer', userSelect: 'none' }}
      width="100%"
      padding="4px"
      borderRadius="4px"
      onBlur={onBlur && (event => onBlur(id, value))}
      onFocus={onFocus && (event => onFocus(id, value))}
      onClick={() => onChange(!value)}
    >
      <Switch checked={value} disabled={shouldDisabled} /> <span style={{ paddingLeft: 8 }}>{label || schema.description}</span>
    </Box>
  );
};