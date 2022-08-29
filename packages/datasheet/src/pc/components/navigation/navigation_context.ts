import { createContext } from 'react';

export interface INavigationContext {
  openCreateSpaceModal: () => void;
  closeSpaceListDrawer: () => void;
}

export const NavigationContext = createContext({} as INavigationContext);
