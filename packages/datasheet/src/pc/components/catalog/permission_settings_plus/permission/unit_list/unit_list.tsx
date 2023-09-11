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
import { IRoleOption } from '../unit_item/interface';
import styles from './style.module.less';

export interface IUnitListProps {
  admins: IMember[];
  owner: IMember | null;
  roleUnits: IRoleUnit[];
  readonly?: boolean;
  isAppointMode: boolean;
  roleOptions?: IRoleOption[];
  // setChangingRoleUnitId: React.Dispatch<React.SetStateAction<string>>;
  onDelete?: (unitId: string) => void;
  onChange?: (unitId: string, role: string) => void;
}

export const UnitList: FC<React.PropsWithChildren<IUnitListProps>> = ({
  roleUnits,
  admins,
  owner,
  roleOptions,
  readonly,
  isAppointMode,
  onDelete,
  onChange,
}) => {
  return (
    <div className={styles.unitList}>
      {admins.map((admin) => {
        const isPermissionOpener = Boolean(owner && owner.unitId === admin.unitId);
        return (
          <UnitItem
            className={classNames({ [styles.unitItem]: isAppointMode && roleUnits.length && !readonly })}
            key={admin.unitId}
            unit={{
              id: admin.unitId,
              memberId: admin.memberId,
              avatar: admin.avatar,
              avatarColor: admin.avatarColor,
              nickName: admin.nickName,
              name: admin.memberName,
              info: admin.teamData && admin.teamData.length > 0 ? admin.teamData[0].fullHierarchyTeamName || '' : '',
              isMemberNameModified: admin.isMemberNameModified,
              isTeam: false,
            }}
            role={'manager'}
            identity={{
              admin: true,
              permissionOpener: isPermissionOpener,
            }}
            roleOptions={roleOptions}
            disabled
            allowRemove={false}
            isAppointMode={isAppointMode}
          />
        );
      })}
      {owner && admins.findIndex((admin) => admin.unitId === owner.unitId) === -1 && (
        <UnitItem
          className={classNames({ [styles.unitItem]: isAppointMode && roleUnits.length && !readonly })}
          key={owner.unitId}
          unit={{
            id: owner.unitId,
            memberId: owner.memberId,
            avatar: owner.avatar,
            avatarColor: owner.avatarColor,
            nickName: owner.nickName,
            name: owner.memberName,
            info: owner.teamData && owner.teamData.length > 0 ? owner.teamData[0].fullHierarchyTeamName || '' : '',
            isMemberNameModified: owner.isMemberNameModified,
            isTeam: false,
          }}
          role={'manager'}
          identity={{
            permissionOpener: true,
          }}
          roleOptions={roleOptions}
          disabled
          allowRemove={false}
          isAppointMode={isAppointMode}
        />
      )}
      {roleUnits.map((unit) => {
        const teamInfo = unit.teamData && unit.teamData.length > 0 ? unit.teamData[0].fullHierarchyTeamName || '' : '';
        return (
          admins.findIndex((admins) => admins.unitId === unit.unitId) === -1 && (
            <UnitItem
              key={unit.unitId}
              unit={{
                id: unit.unitId,
                memberId: unit.unitRefId || '',
                avatar: unit.avatar,
                avatarColor: unit.avatarColor,
                nickName: unit.nickName,
                name: unit.unitName,
                info: teamInfo,
                isTeam: unit.unitType !== 3,
              }}
              role={unit.role}
              disabled={readonly}
              onChange={onChange}
              onRemove={onDelete}
              roleOptions={roleOptions}
              isAppointMode={isAppointMode}
            />
          )
        );
      })}
    </div>
  );
};
