import { ISearchPanelState } from '../interface/search_panel';

export const searchPanelReducer = (oldState: ISearchPanelState, newState: Partial<ISearchPanelState>) => {
  return {
    ...oldState,
    ...newState,
  };
};
