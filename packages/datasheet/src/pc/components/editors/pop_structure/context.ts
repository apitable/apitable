import { createContext } from 'react';

interface IPopStructureContext {
  restHeight: number;
}

export const PopStructureContext = createContext({} as IPopStructureContext);