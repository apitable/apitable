import { atom } from 'jotai';
import { IPermissions } from '@apitable/core';

interface ICustomPageAtom {
  desc?: string;
  permission?: IPermissions;
  url?: string;
}

export const CustomPageAtom = atom<ICustomPageAtom | null>(null);
