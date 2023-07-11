import { ISearchPanelState } from '../interface/search_panel';

export const searchPanelReducer = (oldState: ISearchPanelState, newState: Partial<ISearchPanelState>) => {
  // console.trace('fresh panel', newState);
  return {
    ...oldState,
    ...newState,
  };
};
