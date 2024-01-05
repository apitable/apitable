import { atom } from 'jotai';
import { IPermissions } from '@apitable/core';

interface IEmbedPageAtom {
  desc?: string;
  permission?: IPermissions;
  url?: string;
}

export const embedPageAtom = atom<IEmbedPageAtom | null>(null);
