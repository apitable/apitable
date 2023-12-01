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
  CalendarStyleKeyType,
  CollaCommandName,
  DateTimeField,
  ExecuteResult,
  FieldType,
  getNewId,
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
import OrgChartCreationNoPermission from 'static/icon/account/org_chart_creation_no_permission.png';
import GanttCreationDateDark from 'static/icon/account/view_add_date_dark.png';
import GanttCreationDateLight from 'static/icon/account/view_add_date_light.png';
import styles from './style.module.less';

export const CreateFieldModal = memo(() => {
  const { viewId, columnCount, exitFieldNames, permissions } = useAppSelector((state) => {
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    return {
      viewId: Selectors.getActiveViewId(state)!,
      columnCount: Selectors.getColumnCount(state)!,
      exitFieldNames: Object.values(fieldMap).map((field) => field.name),
      permissions: Selectors.getPermissions(state),
    };
  });
  const manageable = permissions.manageable;
  const themeName = useAppSelector((state) => state.theme);
  const GanttCreationDate = themeName === ThemeName.Light ? GanttCreationDateLight : GanttCreationDateDark;

  const generateField = (fieldId: string, name: string) => {
    return {
      id: fieldId,
      name: getUniqName(name, exitFieldNames),
      type: FieldType.DateTime,
      property: DateTimeField.defaultProperty(),
    };
  };

  const handleClick = () => {
    if (!manageable) {
      return;
    }
    const startFieldId = getNewId(IDPrefix.Field);
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: generateField(startFieldId, t(Strings.start_field_name)),
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

      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetCalendarStyle,
        viewId: viewId!,
        data: [
          {
            styleKey: CalendarStyleKeyType.StartFieldId,
            styleValue: startFieldId,
          },
        ],
      });
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
      zIndex={12}
    >
      <div className={styles.createFieldModal}>
        <div className={styles.banner}>
          <div className={styles.bannerImg}>
            <Image
              src={manageable ? GanttCreationDate : OrgChartCreationNoPermission}
              alt={t(Strings.calendar_create_img_alt)}
              width={320}
              height={192}
            />
          </div>
        </div>
        <Typography variant="h5" align={'center'}>
          {manageable ? t(Strings.calendar_init_fields_button) : t(Strings.calendar_no_permission)}
        </Typography>
        <Typography variant="body4" className={styles.desc}>
          {manageable ? t(Strings.calendar_init_fields_desc) : t(Strings.calendar_no_permission_desc)}
        </Typography>
        <Button
          color="primary"
          className={styles.createBtn}
          onClick={handleClick}
          disabled={!manageable}
          prefixIcon={<AddOutlined size={16} color={'white'} />}
        >
          {t(Strings.calendar_init_fields_button)}
        </Button>
      </div>
    </Modal>
  );
});
