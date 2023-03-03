
import { IReduxState } from 'exports/store/interfaces';
import { ViewDerivateGrid } from './view_derivate_grid';

// gantt is consistent with the data required by the Grid view.
export class ViewDerivateGantt extends ViewDerivateGrid {
  constructor(protected override state: IReduxState, public override datasheetId: string) {
    super(state, datasheetId);
  }
}
