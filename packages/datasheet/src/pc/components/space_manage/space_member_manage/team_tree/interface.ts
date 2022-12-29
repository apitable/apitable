import { Dispatch, SetStateAction } from 'react';
import { IMemberInfoInSpace } from '@apitable/core';

export interface IModalProps {
  setSearchMemberRes: Dispatch<SetStateAction<IMemberInfoInSpace[]>>;
}
