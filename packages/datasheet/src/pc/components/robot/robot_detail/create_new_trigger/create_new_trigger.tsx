import { message } from 'antd';
import { FC } from 'react';
import styled from 'styled-components';
import { Box, Typography } from '@apitable/components';

import {
  ButtonActionType,
  CollaCommandName,
  ExecuteResult,
  FieldType,
  getNewId,
  getUniqName,
  IAddFieldsOptions,
  IButtonField,
  IDPrefix,
  ResourceType,
  Selectors,
  Strings,
  t
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { AutomationConstant } from 'pc/components/automation/config';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';

export const useColumnInfo: (resourceId: string) => {
  viewId: any;
  exitFieldNames: string[];
  columnCount: any
} = (resourceId: string) => {

  const data = useAppSelector((state) => {

    const fieldMap = Selectors.getFieldMap(state, resourceId);
    const datasheet = Selectors.getDatasheet(state, resourceId);
    const views = datasheet?.snapshot.meta.views;

    const names = Object.values(fieldMap ?? {}).map((field) => field.name);
    return {
      viewId: Selectors.getActiveViewId(state)!,
      columnCount: views?.[0].columns?.length ?? names.length,
      // @ts-ignore
      exitFieldNames: names,
      permissions: Selectors.getPermissions(state),
    };
  });
  return data;
};

export const handleCreateNewTrigger = (resourceId: string, datasheetId: string, triggerId: string, columnInfo: {
  viewId: any;
  exitFieldNames: string[];
  columnCount: any
}, onSubmit : (value: string)=> void) => {
  const { viewId, exitFieldNames, columnCount } = columnInfo;

  const generateField = (fieldId: string, name: string): IButtonField => {
    return {
      id: fieldId,
      name: getUniqName(name, exitFieldNames),
      type: FieldType.Button,
      property: {
        text: AutomationConstant.DEFAULT_TEXT,
        style: {
          type: 0,
          color: AutomationConstant.defaultColor,
        },
        action: {
          type: ButtonActionType.TriggerAutomation,
          automation:  {
            triggerId,
            automationId: resourceId
          },
        },
      },
    };
  };

  const startFieldId = getNewId(IDPrefix.Field);

  const d: IAddFieldsOptions = {
    cmd: CollaCommandName.AddFields,
    resourceId,
    datasheetId: datasheetId,
    resourceType: ResourceType.Datasheet,
    data: [
      {
        data: generateField(startFieldId, t(Strings.button)),
        viewId,
        hiddenColumn: false,
        forceColumnVisible:  true,
        index: columnCount,
      },
    ],
  };
  try {
    const result = resourceService.instance!.commandManager.execute(d );
    if(result.result === ExecuteResult.Success) {
      onSubmit(startFieldId);
    }else {
      message.error('Error');
    }
  } catch (e) {
    console.error(e);
  }
};

const StyledBox = styled(Box)`
  cursor: pointer;
`;

export const CreateNewTrigger: FC<{resourceId: string, datasheetId: string, triggerId: string, onSubmit: (id: string) => void}> = ({ resourceId, datasheetId, triggerId, onSubmit }) => {
  const columnInfo= useColumnInfo(datasheetId);
  const colors = useCssColors();
  return (
    <StyledBox
      display={'flex'}
      alignItems={'center'}
      justifyContent={'flex-start'}
      onClick={()=> handleCreateNewTrigger(resourceId, datasheetId, triggerId, columnInfo, onSubmit)}>
      <Box marginRight={'4px'} display={'flex'} alignItems={'center'}>
        <AddOutlined color={colors.textBrandDefault} size={'small'} />
      </Box>
      <Typography color={colors.textBrandDefault} variant={'body4'} >
        {
          t(Strings.create_new_button_field)
        }
      </Typography>
    </StyledBox>
  );
};
