/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Modal } from 'antd';
import Image from 'next/image';
import { memo } from 'react';
import { Button, Typography, ThemeName } from '@apitable/components';
import {
  CollaCommandName,
  DateTimeField,
  ExecuteResult,
  FieldType,
  GanttStyleKeyType,
  getNewIds,
  getUniqName,
  IDPrefix,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view/id';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import GanttCreationNoDate from 'static/icon/account/gantt_creation_nodate.png';
import GanttCreationDateDark from 'static/icon/account/view_add_date_dark.png';
import GanttCreationDateLight from 'static/icon/account/view_add_date_light.png';
import styles from './style.module.less';

export const CreateFieldModal = memo(() => {
  const { viewId, columnCount, exitFieldNames, permissions, ganttStyle } = useAppSelector((state) => {
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    return {
      viewId: Selectors.getActiveViewId(state)!,
      ganttStyle: Selectors.getGanttStyle(state)!,
      columnCount: Selectors.getColumnCount(state)!,
      exitFieldNames: Object.values(fieldMap).map((field) => field.name),
      permissions: Selectors.getPermissions(state),
    };
  });
  const manageable = permissions.manageable;

  const generateField = (fieldId: string, name: string) => {
    return {
      id: fieldId,
      name: getUniqName(name, exitFieldNames),
      type: FieldType.DateTime,
      property: DateTimeField.defaultProperty(),
    };
  };
  const themeName = useAppSelector((state) => state.theme);
  const GanttCreationDate = themeName === ThemeName.Light ? GanttCreationDateLight : GanttCreationDateDark;
  const onClick = () => {
    // Fields can only be created with administrative privileges
    if (!manageable) {
      return;
    }
    const [startFieldId, endFieldId] = getNewIds(IDPrefix.Field, 2);
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: generateField(endFieldId, t(Strings.gantt_end_field_name)),
          viewId,
          index: columnCount,
        },
        {
          data: generateField(startFieldId, t(Strings.gantt_start_field_name)),
          viewId,
          index: columnCount,
        },
      ],
    });

    if (ExecuteResult.Success === result.result) {
      notify.open({
        message: t(Strings.toast_add_field_success),
        key: NotifyKey.AddField,
      });

      executeCommandWithMirror(
        () => {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetGanttStyle,
            viewId: viewId!,
            data: [
              {
                styleKey: GanttStyleKeyType.StartFieldId,
                styleValue: startFieldId,
              },
              {
                styleKey: GanttStyleKeyType.EndFieldId,
                styleValue: endFieldId,
              },
            ],
          });
        },
        {
          style: {
            ...ganttStyle,
            [GanttStyleKeyType.StartFieldId]: startFieldId,
            [GanttStyleKeyType.EndFieldId]: endFieldId,
          },
        },
      );
    }
  };

  return (
    <Modal
      visible
      title={null}
      closable={false}
      destroyOnClose
      footer={null}
      maskClosable
      width={368}
      centered
      getContainer={() => document.getElementById(DATASHEET_VIEW_CONTAINER_ID)!}
      maskStyle={{ position: 'absolute' }}
      wrapClassName={styles.modalWrap}
      zIndex={1}
    >
      <div className={styles.createFieldModal}>
        <div className={styles.banner}>
          <span className={styles.bannerImg}>
            <Image src={manageable ? GanttCreationDate : GanttCreationNoDate} alt="Gantt chart creation time field banner" />
          </span>
        </div>
        <Typography variant="h7" align={'center'}>
          {manageable ? t(Strings.gantt_init_fields_title) : t(Strings.gantt_init_fields_no_permission_title)}
        </Typography>
        <Typography variant="body4" className={styles.desc}>
          {manageable ? t(Strings.gantt_init_fields_desc) : t(Strings.gantt_init_fields_no_permission_desc)}
        </Typography>
        <Button
          color="primary"
          className={styles.createBtn}
          onClick={onClick}
          size={'middle'}
          disabled={!manageable}
          prefixIcon={<AddOutlined size={16} color={'white'} />}
        >
          {t(Strings.gantt_init_fields_button)}
        </Button>
      </div>
    </Modal>
  );
});
