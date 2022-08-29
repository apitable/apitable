import { createContext } from 'react';
import { IApi } from '@vikadata/core';

export const SpaceContext = createContext<{ adData: IApi.IAdData | null }>({ adData: null });