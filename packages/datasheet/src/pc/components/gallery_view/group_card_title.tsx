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

import { FC } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { Selectors, Strings, t, ConfigConstant } from '@apitable/core';
import { FieldPermissionLock, getFieldLock } from 'pc/components/field_permission';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { store } from 'pc/store';
import styles from './style.module.less';
interface IGroupCardTitleProps {
  recordId: string;
}
export const GroupCardTitle: FC<React.PropsWithChildren<IGroupCardTitleProps>> = ({ recordId }) => {
  const colors = useThemeColors();
  function partOfCellValue(recordId: string) {
    const state = store.getState();
    const groupInfo = Selectors.getActiveViewGroupInfo(state);
    const fieldId = groupInfo[0].fieldId;
    const snapshot = Selectors.getSnapshot(state)!;
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
    const field = Selectors.getSnapshot(state)!.meta.fieldMap[fieldId];
    const datasheetId = Selectors.getActiveDatasheetId(state);
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
    let permissionInfo: any = null;
    const isCryptoField = Boolean(fieldRole && fieldRole === ConfigConstant.Role.None);
    if (fieldPermissionMap && fieldRole) {
      permissionInfo = getFieldLock(fieldPermissionMap[fieldId].manageable ? ConfigConstant.Role.Manager : fieldRole);
    }
    const commonStyle: React.CSSProperties = {
      color: colors.thirdLevelText,
      flex: '1',
      whiteSpace: 'nowrap',
      marginLeft: '10px',
    };
    if (isCryptoField) {
      return (
        <div style={{ ...commonStyle, display: 'flex' }}>
          {t(Strings.crypto_field)}
          <FieldPermissionLock fieldId={fieldId} isLock tooltip={permissionInfo?.[1] || ''} />
        </div>
      );
    }
    if (cellValue === undefined) {
      return <div style={commonStyle}>({t(Strings.data_error)})</div>;
    }
    if (cellValue === null) {
      return <div style={commonStyle}>({t(Strings.content_is_empty)})</div>;
    }

    return (
      <CellValue field={field} recordId={recordId} cellValue={cellValue} datasheetId={datasheetId} cellTextClassName={styles.galleryGroupTitle} />
    );
  }

  return <div className={styles.gallaryGroupTitlebox}>{partOfCellValue(recordId)}</div>;
};
