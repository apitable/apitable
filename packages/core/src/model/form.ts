import { IFormProps } from '../store';
import { IJOTAction } from 'engine';
import { OTActionName } from '../engine/ot';

export class FormAction {
  // update own properties
  static updatePropsAction(
    formProps: IFormProps,
    options: {
      partialProps: Partial<IFormProps>
    }
  ): IJOTAction[] {
    const { partialProps } = options;
    const actions: IJOTAction[] = [];
    for (const key in partialProps) {
      actions.push({
        n: OTActionName.ObjectReplace,
        p: ['formProps', key],
        oi: partialProps[key],
        od: formProps[key],
      });
    }
    return actions;
  }

}
