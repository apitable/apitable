import { createContext } from 'react';

interface IViewFilterContextValue {
  isViewLock: boolean;
}

export const ViewFilterContext = createContext<IViewFilterContextValue>({ isViewLock: false });
