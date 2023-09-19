import { Message } from '@apitable/components';
import { CollaCommandName, ExecuteResult, ITemporaryView, StoreActions, Strings, t } from '@apitable/core';
import { store } from 'pc/store';
import { resourceService } from '../../../resource_service';
import { expandViewLock } from '../../view_lock/expand_view_lock';
import { requestServerView } from './popup_content/request_server_view';

export interface IViewPropertyUpdateProps {
  autoSave: boolean;
  datasheetId: string;
  viewId: string;
  onClose: (value?: boolean) => void;
  isViewLock: boolean;
  shareId?: string;
}

const modifyViewProperty = async (props: IViewPropertyUpdateProps) => {
  const { datasheetId, viewId, autoSave, shareId, onClose, isViewLock } = props;
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
    viewProperty: serverViewDate as ITemporaryView,
  });
  if (ExecuteResult.Success === result) {
    store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
    Message.success({
      content: t(Strings.view_property_sync_success),
    });
  }
};

const cancelModification = async (props: IViewPropertyUpdateProps) => {
  const { datasheetId, viewId, autoSave, shareId, onClose } = props;
  onClose();
  if (autoSave) {
    return;
  }
  const serverViewData = await requestServerView(datasheetId!, viewId, shareId);

  store.dispatch(
    StoreActions.setViewProperty(datasheetId!, {
      viewId,
      viewProperty: serverViewData,
    }),
  );
  store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
  Message.success({
    content: t(Strings.view_configuration_changes_have_been_reversed),
  });
};

export { cancelModification, modifyViewProperty };
