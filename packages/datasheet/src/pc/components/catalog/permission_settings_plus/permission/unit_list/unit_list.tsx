import { FC } from 'react';
import { IRoleUnit, IMember } from '@vikadata/core';
import { UnitItem } from '../unit_item';
import styles from './style.module.less';
import classNames from 'classnames';

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

export const UnitList: FC<IUnitListProps> = ({
  roleUnits,
  admins,
  owner,
  readonly,
  isAppointMode,
  onDelete,
  onChange,
}) => {
  return (
    <div className={styles.unitList}>
      {admins.map(admin => {
        const isPermissionOpener = Boolean(owner && owner.unitId === admin.unitId);
        return <UnitItem
          className={classNames({ [styles.unitItem]: isAppointMode && roleUnits.length && !readonly })}
          key={admin.unitId}
          unit={{
            id: admin.unitId,
            memberId: admin.memberId,
            avatar: admin.avatar,
            name: admin.memberName,
            info: (admin.teamData && admin.teamData.length > 0 ) ? admin.teamData[0].fullHierarchyTeamName || '' : '',
            isMemberNameModified: admin.isMemberNameModified,
            isTeam: false,
          }}
          role={'manager'}
          identity={{
            admin: true,
            permissionOpener: isPermissionOpener,
          }}
          disabled
          allowRemove={false}
          isAppointMode={isAppointMode}
        />;
      })}
      {
        owner && admins.findIndex(admin => admin.unitId === owner.unitId) === -1 &&
        (
          <UnitItem
            className={classNames({ [styles.unitItem]: isAppointMode && roleUnits.length && !readonly })}
            key={owner.unitId}
            unit={{
              id: owner.unitId,
              memberId: owner.memberId,
              avatar: owner.avatar,
              name: owner.memberName,
              info: (owner.teamData && owner.teamData.length > 0 ) ? owner.teamData[0].fullHierarchyTeamName || '' : '',
              isMemberNameModified: owner.isMemberNameModified,
              isTeam: false,
            }}
            role={'manager'}
            identity={{
              permissionOpener: true,
            }}
            disabled
            allowRemove={false}
            isAppointMode={isAppointMode}
          />
        )
      }
      {roleUnits.map(unit => {
        const teamInfo = (unit.teamData && unit.teamData.length > 0 ) ? unit.teamData[0].fullHierarchyTeamName || '' : '';
        return (
          admins.findIndex(admins => admins.unitId === unit.unitId) === -1 &&
        (
          <UnitItem
            key={unit.unitId}
            unit={{
              id: unit.unitId,
              memberId: unit.unitRefId || '',
              avatar: unit.avatar,
              name: unit.unitName,
              info: teamInfo,
              isTeam: unit.unitType !== 3,
            }}
            role={unit.role}
            disabled={readonly}
            onChange={onChange}
            onRemove={onDelete}
            isAppointMode={isAppointMode}
          />
        )
        );})}
    </div>
  );
};
