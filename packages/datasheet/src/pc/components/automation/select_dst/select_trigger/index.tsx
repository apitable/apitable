import React, { FC } from 'react';
import { Box, SelectItem, StyledSelectedContainer, StyledSelectTrigger } from '@apitable/components';
import { NodeType } from '@apitable/core/dist/config/constant';
import { DatasheetOutlined, FormOutlined } from '@apitable/icons';
import { useCssColors } from '../../../robot/robot_detail/trigger/use_css_colors';

export const SelectTrigger: FC<React.PropsWithChildren< {
    value?: string
    label?:string
    variant : NodeType.DATASHEET | NodeType.FORM,
    onClick?: () => void;
    placeholder?:string
}>> = ({ value, label, variant, onClick, placeholder }) => {

  const colors = useCssColors();
  return (
    <StyledSelectTrigger
      disabled={false}
      onClick={onClick}
      focus={false}
      tabIndex={-1}
      data-name='select'
    >

      <StyledSelectedContainer
        className={'ellipsis'}
      >
        {
          label != '' && label != null && (
            <Box marginRight={'8px'} alignItems={'center'}>
              {
                variant === NodeType.DATASHEET ? (
                  <DatasheetOutlined size={16} color={colors.textCommonTertiary} />)
                  :
                  (<FormOutlined size={16} color={colors.textCommonTertiary} />)
              }
            </Box>
          )
        }
        {label}
        {!label && (
          value != null ? <SelectItem
            renderValue={(item) => item.label}
            item={{
              value: value,
              label: label ?? ''
            }}
          /> :
            <span className={'placeholder ellipsis'}>
              {placeholder}
            </span>
        )
        }
      </StyledSelectedContainer>
    </StyledSelectTrigger>
  );
};
