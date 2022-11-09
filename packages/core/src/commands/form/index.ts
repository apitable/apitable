import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { FormAction } from '../../model/form';
import { IFormProps, Selectors } from '../../exports/store';
import { CollaCommandName } from '..';

export interface IUpdateFormProps {
  cmd: CollaCommandName.UpdateFormProps;
  formId: string;
  partialProps: Partial<IFormProps>
}

export const updateFormProps: ICollaCommandDef<IUpdateFormProps> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { model: state } = context;
    const { formId, partialProps } = options;
    const snapshot = Selectors.getFormSnapshot(state, formId);
    if (!snapshot) {
      return null;
    }
    
    const updateFormPropsAction = FormAction.updatePropsAction(snapshot.formProps, { partialProps });
    return {
      result: ExecuteResult.Success,
      resourceId: formId,
      resourceType: ResourceType.Form,
      actions: updateFormPropsAction,
    };
  },
};