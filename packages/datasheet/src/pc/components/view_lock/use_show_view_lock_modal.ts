import { useSelector } from 'react-redux';
import { IViewProperty, Selectors } from '@apitable/core';

export const useShowViewLockModal = () => {
  const spaceManualSaveViewIsOpen = useSelector(state => {
    return state.labs.includes('view_manual_save') || Boolean(state.share.featureViewManualSave);
  });
  const activeView: IViewProperty = useSelector(state => Selectors.getCurrentView(state))!;
  const hasMirrorId = useSelector(state => Boolean(state.pageParams.mirrorId));

  if (hasMirrorId) {
    return false;
  }

  if (!spaceManualSaveViewIsOpen || activeView.autoSave) {
    return Boolean(activeView.lockInfo);
  }

  return false;
};
