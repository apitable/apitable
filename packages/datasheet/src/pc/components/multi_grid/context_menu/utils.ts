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

import { CollaCommandName, ExecuteResult, getUniqName, IField, IFieldMap, Strings, t } from '@apitable/core';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { resourceService } from 'pc/resource_service';
import { DEFAULT_FONT_FAMILY, getTextWidth } from 'pc/utils';

export const getShowFieldName = (name: string) => {
  const fieldNameWidth = getTextWidth(name, `13px ${DEFAULT_FONT_FAMILY}`);
  if (fieldNameWidth > 80) {
    const cutIndex = Math.floor((80 / fieldNameWidth) * name.length);
    return name.slice(0, cutIndex) + '...';
  }
  return name;
};

export const getCopyField = (field: IField, fieldMap: IFieldMap, viewId?: string, datasheetId?: string) => {
  return (index: number, fieldId: string, offset: number, hiddenColumn?: boolean) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      copyCell: true,
      fieldId: field.id,
      data: [
        {
          data: {
            name: getUniqName(
              field.name + t(Strings.copy),
              Object.keys(fieldMap).map((id) => fieldMap[id].name),
            ),
            type: field.type,
            property: field.property,
          },
          viewId: viewId,
          index: index,
          fieldId,
          offset,
          hiddenColumn,
        },
      ],
      datasheetId,
    });

    if (ExecuteResult.Success === result.result) {
      notifyWithUndo(t(Strings.toast_duplicate_field_success), NotifyKey.DuplicateField);
    }
  };
};
