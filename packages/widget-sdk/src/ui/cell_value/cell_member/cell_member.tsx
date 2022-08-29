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