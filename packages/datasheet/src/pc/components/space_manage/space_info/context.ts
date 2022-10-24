import { createContext } from 'react';
import { IApi } from '@apitable/core';

export const SpaceContext = createContext<{ adData: IApi.IAdData | null }>({ adData: null });