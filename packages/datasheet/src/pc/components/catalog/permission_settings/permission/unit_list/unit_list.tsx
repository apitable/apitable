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

import classNames from 'classnames';
import { FC } from 'react';
import { IRoleUnit, IMember } from '@apitable/core';
import { UnitItem } from '../unit_item';
import styles from './style.module.less';

export interface IUnitListProps {
  admins: IMember[];
  owner: IMember | null;
  roleUnits: IRoleUnit[];
  readonly?: boolean;
  isAppointMode: boolean;
  // setChangingRoleUnitId: React.Dispatch<React.SetStateAction<string>>;
  onDelete?: (unitId: string) => void;
  onChange?: (unitId: string, role: string) => void;
}

export const UnitList: FC<React.PropsWithChildren<IUnitListProps>> = ({ roleUnits, admins, owner, readonly, isAppointMode, onDelete, onChange }) => {
  return (
    <div className={styles.unitList}>
      {admins.map((admin) => {
        const isPermissionOpener = Boolean(owner && owner.unitId === admin.unitId);
        const disabled = readonly || (!readonly && isPermissionOpener) || isAppointMode;
        return (
          <UnitItem
            className={classNames({ [styles.unitItem]: isAppointMode && roleUnits.length && !readonly })}
            key={admin.unitId}
            unit={{
              id: admin.unitId,
              avatar: admin.avatar,
              name: admin.memberName,
              info: admin.teams,
              isMemberNameModified: admin.isMemberNameModified,
              isTeam: false,
            }}
            role={'manager'}
            identity={{
              admin: true,
              permissionOpener: isPermissionOpener,
            }}
            disabled={disabled}
            allowRemove={false}
          />
        );
      })}
      {owner && admins.findIndex((admin) => admin.unitId === owner.unitId) === -1 && (
        <UnitItem
          className={classNames({ [styles.unitItem]: isAppointMode && roleUnits.length && !readonly })}
          key={owner.unitId}
          unit={{
            id: owner.unitId,
            avatar: owner.avatar,
            name: owner.memberName,
            info: owner.teams,
            isMemberNameModified: owner.isMemberNameModified,
            isTeam: false,
          }}
          role={'manager'}
          identity={{
            permissionOpener: true,
          }}
          disabled={readonly || isAppointMode}
          allowRemove={false}
        />
      )}
      {roleUnits.map(
        (unit) =>
          admins.findIndex((admins) => admins.unitId === unit.unitId) === -1 && (
            <UnitItem
              key={unit.unitId}
              unit={{
                id: unit.unitId,
                avatar: unit.avatar,
                name: unit.unitName,
                info: unit.teams,
                isTeam: unit.unitType !== 3,
              }}
              role={unit.role}
              disabled={readonly}
              onChange={onChange}
              onRemove={onDelete}
            />
          ),
      )}
    </div>
  );
};
