import { ITemplateCategory, ITemplateDirectory } from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

export function updateTemplateCategory(data: ITemplateCategory[]) {
  return {
    type: actions.UPDATE_TEMPLATE_CATEGORY,
    payload: data,
  };
}

export function updateTemplateDirectory(data: ITemplateDirectory | null) {
  return {
    type: actions.UPDATE_TEMPLATE_DIRECTORY,
    payload: data,
  };
}
