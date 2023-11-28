import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { Box, Typography } from '@apitable/components';
import { ButtonActionType, FieldType, IButtonField, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import EllipsisText from 'pc/components/ellipsis_text';
import { getFieldTypeIcon, getFieldTypeIconOrNull } from 'pc/components/multi_grid/field_setting';
import {
  handleCreateNewTrigger,
  useColumnInfo
} from 'pc/components/robot/robot_detail/create_new_trigger/create_new_trigger';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';

const PointerCursorBox = styled(Box)`
 cursor: pointer !important;
`;

export const ReadonlyFieldColumn: FC<{
    datasheetId: string,
    resourceId: string,
    triggerId: string,
    fieldId: string,
    onSubmit: (value: string) => void
}> = ({ datasheetId, fieldId, triggerId, resourceId, onSubmit }) => {

  const snapshot = useAppSelector((state) => {
    return Selectors.getSnapshot(state, datasheetId);
  });

  const fieldMap = snapshot?.meta?.fieldMap;

  const columnInfo= useColumnInfo(datasheetId);

  const colors = useCssColors();
  let fieldItem = fieldMap?.[fieldId] as IButtonField|undefined;
  if(fieldItem?.type !== FieldType.Button) {
    fieldItem = undefined;
  }
  if(fieldItem?.property?.action?.type !== ButtonActionType.TriggerAutomation ) {
    fieldItem = undefined;
  }

  if(fieldId == null || fieldId ==='') {
    return null;
  }
  if( fieldItem == null) {
    return (
      <PointerCursorBox paddingY={'8px'} borderColor={colors.textDangerDefault} cursor={'pointer'}
        paddingLeft={'8px'}
        borderWidth={'1px'}
        width={'100%'}
        borderStyle={'solid'}
        paddingRight={'8px'}
        onClick={()=> handleCreateNewTrigger(resourceId, datasheetId, triggerId, columnInfo, onSubmit)}
        borderRadius={'4px'}
      >
        <Box
          display={'inline-flex'}
          alignItems={'center'}
          cursor={'pointer'}
          width={'100%'}
          justifyContent={'flex-start'}
        >
          <AddOutlined color={colors.textCommonQuaternary} />
          <Box marginLeft={'8px'} display={'inline-flex'} alignItems={'center'} flex={'1 1 auto'} cursor={'pointer'} >
            <Typography variant="body4" color={colors.textCommonQuaternary} >

              {t(Strings.create_new_button_field)}
            </Typography>
          </Box>
        </Box>
      </PointerCursorBox>
    );
  }

  const item = getFieldTypeIconOrNull(fieldItem.type) == null ? getFieldTypeIcon(FieldType.Number) : getFieldTypeIcon(fieldItem.type);
  return (
    <PointerCursorBox paddingY={'8px'} backgroundColor={colors.bgControlsDisabled} cursor={'not-allowed'}
      paddingLeft={'8px'}
      paddingRight={'8px'}
      borderRadius={'4px'}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box display={'inline-flex'} alignItems={'center'}>

          <>
            {
              React.cloneElement(item, {
                color: colors.textCommonDisabled
              })
            }
          </>

          <Box marginLeft={'8px'} display={'inline-flex'} alignItems={'center'} maxWidth={'80%'}>
            <EllipsisText>
              <Typography variant="body4" color={colors.textCommonDisabled}>
                {fieldItem?.name ?? ''}
              </Typography>
            </EllipsisText>
          </Box>
        </Box>

      </Box>
    </PointerCursorBox>
  );
};
