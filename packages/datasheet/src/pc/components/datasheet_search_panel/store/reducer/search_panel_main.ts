import { ISearchPanelMainState } from '../interface/search_panel_main';

export const searchPanelMainReducer = (oldState: ISearchPanelMainState, newState: Partial<ISearchPanelMainState>) => {
  return {
    ...oldState,
    ...newState,
  };
};
