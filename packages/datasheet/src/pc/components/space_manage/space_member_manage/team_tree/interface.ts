import { Dispatch, SetStateAction } from 'react';
import { IMemberInfoInSpace } from '@vikadata/core';
export interface IDepts {
  teamId: string;
  teamName: string;
  parentName: string;
  shortName: string;
}
export interface IMembers {
  memberId: string;
  memberName: string;
  avatar: string;
  team: string;
}

export interface IModalProps {
  setSearchMemberRes: Dispatch<SetStateAction<IMemberInfoInSpace[]>>;
}
