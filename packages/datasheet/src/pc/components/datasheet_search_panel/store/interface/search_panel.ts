import { IMeta } from '@apitable/core';

export interface ISearchPanelState {
  currentMeta: IMeta | null
  loading: boolean
  currentDatasheetId: string
  currentViewId: string
}
