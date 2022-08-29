import { createContext } from 'react';

export interface IWecomIntegrationContext {
  scrollTo: (x?: number, y?: number) => void;
}

export const WecomIntegrationContext = createContext({} as IWecomIntegrationContext);