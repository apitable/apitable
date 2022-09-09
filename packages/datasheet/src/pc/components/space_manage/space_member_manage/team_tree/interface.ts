import { Dispatch, SetStateAction } from 'react';
import { IMemberInfoInSpace } from '@vikadata/core';

export interface IModalProps {
  setSearchMemberRes: Dispatch<SetStateAction<IMemberInfoInSpace[]>>;
}
