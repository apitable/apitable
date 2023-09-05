import * as React from 'react';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { EditOutlined } from '@apitable/icons';
import { TextInput } from './text_input';
import { Typography } from '../typography';
import { Box } from '../box';

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
export const EditableText: FC<{
    className?: string,
    value: string, placeholder?: string,
    onChange?: (v: string) => void
}> = ({ value, placeholder, className, onChange }) => {

  const [isEditing, setEditing] = useState(false);

  if (isEditing) {

    return (<TextInput
      size="small"
      placeholder={placeholder}
      autoFocus
      block
      defaultValue={value}
      onBlur={(e) => {
        onChange?.(e.target.value);
        setEditing(false);
      }}/>);
  }
  return (

    <StyledBox onClick={() => setEditing(true)} onDoubleClick={() => setEditing(true)} display={'inline-flex'}
      alignItems={'center'}>

      <Typography variant="h6" className={className}>
        {value ?? placeholder}
      </Typography>

      <StyledOutlined/>

    </StyledBox>
  );
};