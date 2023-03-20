import { IWidgetDatasheetState } from 'interface';
import { ADD_DATASHEET } from '../../constant';

export interface IAddDatasheetAction {
  type: typeof ADD_DATASHEET;
  datasheetId: string;
  payload: IWidgetDatasheetState;
}

export const addDatasheet = ((
  datasheetId: string,
  datasheetPack: IWidgetDatasheetState,
) => {
  return {
    type: ADD_DATASHEET,
    datasheetId,
    payload: datasheetPack,
  };
});
