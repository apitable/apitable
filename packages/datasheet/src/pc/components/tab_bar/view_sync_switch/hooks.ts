import { Message } from '@apitable/components';
import { CollaCommandName, ExecuteResult, ITemporaryView, StoreActions, Strings, t } from '@apitable/core';
import { expandViewLock } from '../../view_lock/expand_view_lock';
import { resourceService } from '../../../resource_service';
import { store } from '../../../store';
import { requestServerView } from './popup_content';

export interface IViewPropertyUpdateProps {
    autoSave: boolean;
    datasheetId: string;
    viewId: string;
    onClose: (value?: (boolean | undefined)) => void;
    isViewLock: boolean;
    shareId?: string;
}
export const useViewPropertyUpdate = (props: IViewPropertyUpdateProps) => {
  const { datasheetId, viewId, autoSave, shareId,onClose, isViewLock } = props;
  const modifyViewProperty = async() => {
    if (isViewLock) {
      expandViewLock(viewId);
      return;
    }
    onClose();
    if (autoSave) {
      return;
    }
    const serverViewDate = await requestServerView(datasheetId!, viewId, shareId);
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ManualSaveView,
      viewId: viewId!,
      viewProperty: serverViewDate as ITemporaryView
    });
    if (ExecuteResult.Success === result) {
      store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
      Message.success({
        content: t(Strings.view_property_sync_success)
      });
    }
  };

  const cancelModification = async() => {
    onClose();
    if (autoSave) {
      return;
    }
    const serverViewData = await requestServerView(datasheetId!, viewId, shareId);

    store.dispatch(
      StoreActions.setViewProperty(datasheetId!, {
        viewId,
        viewProperty: serverViewData
      })
    );
    store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
    Message.success({
      content: t(Strings.view_configuration_changes_have_been_reversed)
    });
  };
    
  return { cancelModification, modifyViewProperty };
};