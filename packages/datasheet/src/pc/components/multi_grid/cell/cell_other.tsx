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

import { Tooltip } from 'antd';
import * as React from 'react';
import { lightColors } from '@apitable/components';
import { DATASHEET_ID, ICollaborator, ICollaboratorCursor, stringHash2Number, Strings, t } from '@apitable/core';
import { Avatar, AvatarSize } from 'pc/components/common';
import { store } from 'pc/store';
import styles from './styles.module.less';

export const getCollaboratorColor = (collaborator: ICollaboratorCursor): string => {
  const colorsWheel = [
    lightColors.rc02,
    lightColors.rc03,
    lightColors.rc04,
    lightColors.rc05,
    lightColors.rc06,
    lightColors.rc07,
    lightColors.rc08,
    lightColors.rc09,
    lightColors.rc10,
  ];
  const hashColorIndex = stringHash2Number(`${collaborator.userId}${collaborator.socketId}`, colorsWheel.length);
  return colorsWheel[hashColorIndex] as string;
};
export function isAlien(collaborator: ICollaboratorCursor | ICollaborator) {
  if (store.getState().pageParams.shareId) {
    return !collaborator.userName;
  }
  return !(collaborator.memberName || collaborator.userName);
}
export function backCorrectName(collaborator: ICollaboratorCursor | ICollaborator) {
  if (isAlien(collaborator)) return t(Strings.alien);
  return collaborator.memberName || collaborator.userName || t(Strings.alien);
}

export function backCorrectAvatarName(collaborator: ICollaboratorCursor | ICollaborator) {
  if (isAlien(collaborator)) return t(Strings.alien);
  const { nickName, memberName, userName } = collaborator;
  return nickName || memberName || userName || t(Strings.alien);
}

export const CollaboratorMark: React.FC<
  React.PropsWithChildren<{
    displayRowIndex: number;
    collaboratorCell: ICollaboratorCursor[];
  }>
> = ({ displayRowIndex, collaboratorCell }) => {
  if (!collaboratorCell) return null;
  // 1, 2 rows of synergistic cell information will be obscured by the table header, displayed below the cell
  const cellCollaboratorClassName = [1, 2].includes(displayRowIndex) ? styles.cellCollaboratorAvatarsUnder : styles.cellCollaboratorAvatars;
  return (
    <div className={cellCollaboratorClassName}>
      {collaboratorCell.map((c) => {
        const color = getCollaboratorColor(c);
        if (!c.userId) return <></>;
        return (
          <div key={c.userId} className={styles.avatar}>
            <Tooltip title={backCorrectName(c)} placement={[0, 1].includes(displayRowIndex) ? 'bottom' : 'top'}>
              <div>
                <Avatar src={c.avatar} size={AvatarSize.Size24} id={c.userId} title={backCorrectName(c)} style={{ border: `1px solid ${color}` }} />
              </div>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export function renderFillHandle(isLastSelectionCell: boolean | undefined, actualColumnIndex: number) {
  let addStyle: React.CSSProperties = {};
  if (actualColumnIndex === 0) {
    addStyle = { right: -1, borderBottom: `1px solid ${lightColors.primaryColor}`, bottom: -4 };
  }
  return isLastSelectionCell && <div className={styles.fillHandleArea} id={DATASHEET_ID.FILL_HANDLE_AREA} style={{ ...addStyle }} />;
}
