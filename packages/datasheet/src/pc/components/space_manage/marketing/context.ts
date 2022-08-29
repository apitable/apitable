import { createContext } from 'react';

export interface IMarketingContext {
  onSetRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MarketingContext = createContext({} as IMarketingContext);