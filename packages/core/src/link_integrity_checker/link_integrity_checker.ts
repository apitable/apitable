import { AnyAction, Store } from 'redux';
import { IReduxState, Selectors } from '../exports/store';
import { IJOTAction } from 'engine';
import { FieldType, IField } from 'types';

// resolve one-way association @su
export class LinkIntegrityChecker {
  constructor(private store: Store<IReduxState, AnyAction>) {}

  parse(actions: IJOTAction[], datasheetId: string, linkedActions?: { actions: IJOTAction[], datasheetId: string }[]) {
    if (linkedActions?.length) {
      return actions;
    }
    const state = this.store.getState();
    for (const action of actions) {
      if (!action.p.includes('fieldMap')) {
        continue;
      }

      const data = (action['oi'] || action['od']) as IField;
      const currentField = Selectors.getField(state, data.id, datasheetId);

      if (currentField.type !== FieldType.Link) {
        continue;
      }
      return [];
    }
    return actions;
  }
}
