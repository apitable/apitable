import * as React from 'react';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { Box, ITypographyProps, TextInput, Typography } from '@apitable/components';
import { EditOutlined } from '@apitable/icons';
import { useCssColors } from '../robot/robot_detail/trigger/use_css_colors';

const StyledOutlined = styled(EditOutlined)`
  margin-left: 4px;
`;

const StyledBox = styled(Box)`
  ${StyledOutlined} {
    visibility: hidden;
  }

  cursor: pointer;

  :hover {
    ${StyledOutlined} {
      visibility: visible;
    }
  }
`;
export const EditableText: FC<
  {
    value?: string;
    placeholder?: string;
    onChange?: (v: string) => void;
  } & ITypographyProps
> = ({ value, placeholder, onChange, ...rest }) => {
  const [isEditing, setEditing] = useState(false);

  const colors = useCssColors();

  if (isEditing) {
    return (
      <TextInput
        size="small"
        placeholder={placeholder}
        autoFocus
        block
        defaultValue={value}
        onBlur={(e) => {
          onChange?.(e.target.value);
          setEditing(false);
        }}
      />
    );
  }
  return (
    <StyledBox onClick={() => setEditing(true)} onDoubleClick={() => setEditing(true)} display={'inline-flex'} alignItems={'center'}>
      <Typography variant="h6" {...rest}>
        {value || placeholder}
      </Typography>

      <StyledOutlined color={colors.textCommonTertiary} />
    </StyledBox>
  );
};
