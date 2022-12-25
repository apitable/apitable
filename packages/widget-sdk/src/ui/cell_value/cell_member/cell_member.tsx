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

import React, { CSSProperties } from 'react';
import { CellMemberWrapperStyled, CellMemberStyled, NameStyled, AvatarStyled } from './styled';
import { getAvatarRandomColor, getFirstWordFromString } from './utils';

interface IMember {
  avatar: string;
  name: string;
  id: string;
}

interface ICellMember {
  members: IMember | IMember[] | null;
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellMember = (props: ICellMember) => {
  const { members, className, style, cellClassName, cellStyle } = props;
  if (!members) {
    return null;
  }
  const renderMember = (member: IMember) => (
    <CellMemberStyled className={cellClassName} style={cellStyle} key={member.id}>
      {member.avatar ? <AvatarStyled avatar={member.avatar} /> : (
        <AvatarStyled bg={getAvatarRandomColor(member.id)}>
          {getFirstWordFromString(member.name.trim()).toUpperCase()}
        </AvatarStyled>
      )}
      <NameStyled>
        {member.name}
      </NameStyled>
    </CellMemberStyled>
  );
  return (
    <CellMemberWrapperStyled className={className} style={style}>
      {Array.isArray(members) ? members.map(renderMember) : renderMember(members)}
    </CellMemberWrapperStyled>
  );
};