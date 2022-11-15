import { IWidgetProps } from '../../core/interface';
import { TextInput, applyDefaultTheme } from '@apitable/components';
import styled, { css } from 'styled-components';
import { useControllableValue } from 'ahooks';

const HelperText = styled.div.attrs(applyDefaultTheme) <{ error: boolean }>`
  height: 22px;
  font-size: 10px;
  padding: 4px 0 0 8px;
  ${props => props.error && css`
    color: ${props.theme.palette.danger};
  `}
`;

export const TextWidget = (props: IWidgetProps) => {
  // TODO: useControllableValue This hook to see if it can be changed to anti-shake
  const [state, setState] = useControllableValue<{ type: string, value: string }>(props, {
    defaultValue: {
      type: 'Literal',
      value: ''
    },
  });
  const { rawErrors } = props;
  const helperTextVisible = Boolean(rawErrors?.length);
  const helperText = rawErrors?.join(',');
  return (
    <>
      <TextInput
        value={state?.value || ''}
        onChange={e => setState({
          type: 'Literal',
          value: e.target.value
        })}
        block
      />
      {helperTextVisible &&
        <HelperText error>{helperText}</HelperText>
      }
    </>
  );
};
