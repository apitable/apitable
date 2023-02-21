
import { IReduxState, IViewDerivation, IViewProperty } from 'exports/store/interfaces';
import { ViewDerivateBase } from './view_derivate_base';

export class ViewDerivateCalendar extends ViewDerivateBase {
  constructor(protected override state: IReduxState, public override datasheetId: string) {
    super(state, datasheetId);
  }

  override getViewDerivation(view?: IViewProperty): IViewDerivation {
    return super.getViewDerivation(view);
  }
}
