import * as React from 'react';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { Box, ITypographyProps, TextInput, Typography } from '@apitable/components';
import { EditOutlined } from '@apitable/icons';
import EllipsisText from '../ellipsis_text';

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
    className?: string;
    editable?: boolean;
    placeholder?: string;
    onChange?: (v: string) => void;
  } & ITypographyProps
> = ({ value, className, placeholder, editable = false, onChange, ...rest }) => {
  const [isEditing, setEditing] = useState(false);

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
    <StyledBox
      className={className}
      onClick={() => {
        if (!editable) {
          return;
        }
        setEditing(true);
      }}
      onDoubleClick={() => {
        if (!editable) {
          return;
        }
        setEditing(true);
      }}
      display={'inline-flex'}
      alignItems={'center'}
    >
      <EllipsisText>
        <Typography variant="h6" {...rest}>
          {value || placeholder}
        </Typography>
      </EllipsisText>
    </StyledBox>
  );
};
