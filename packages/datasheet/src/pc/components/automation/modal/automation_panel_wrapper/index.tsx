import { useAtom, useAtomValue } from 'jotai';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Strings, t } from '@apitable/core';
import { AutomationPanel } from 'pc/components/automation';
import {
  automationActionsAtom,
  automationCacheAtom,
  automationLocalMap,
  automationPanelAtom,
  automationTriggersAtom
} from 'pc/components/automation/controller';
import { checkIfModified } from 'pc/components/automation/modal/step_input_compare';
import { Modal as ConfirmModal } from 'pc/components/common';

export const AutomationPanelWrapper: React.FC<React.PropsWithChildren<{
    automationId: string;
}>> = React.memo(({ automationId }) => {

  const localState = useAtomValue(automationLocalMap);
  const [panel] = useAtom(automationPanelAtom);

  const [, setCache] = useAtom(automationCacheAtom);
  const isClosedRef = React.useRef(false);

  const triggers = useAtomValue(automationTriggersAtom);
  const actions = useAtomValue(automationActionsAtom);

  const localMap = useAtomValue(automationLocalMap);

  const router = useRouter();
  useEffect(() => {

    return () => {
      setCache({
        id: automationId,
        map: localState,
        panel: panel
      });
    };
  }, [automationId, localState, panel, setCache]);

  const controlVisibleRef: React.MutableRefObject<boolean> = useRef(false);
  const handle = async (url) => {
    if (!checkIfModified({
      triggers,
      actions
    }, localMap)) {
      return;
    }

    router.events.emit('routeChangeError');
    if (!controlVisibleRef.current) {
      controlVisibleRef.current = true;
      router.back();
      const confirmPromise = await new Promise<boolean>((resolve) => {
        ConfirmModal.confirm({
          title: t(Strings.automation_not_save_warning_title),
          content: t(Strings.automation_not_save_warning_description),
          cancelText: t(Strings.cancel),
          okText: t(Strings.confirm),
          onOk: () => {
            isClosedRef.current = true;

            router.push(url);

            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
          type: 'warning',
        });
      });
      return confirmPromise;
    }
    return;
  };

  const debounced = debounce(handle, 200);

  useEffect(() => {
    router.events.on('routeChangeStart', debounced);
    return () => {
      router.events.off('routeChangeStart', debounced);
    };

  }, [debounced, handle, router.events]);

  return (
    <AutomationPanel resourceId={automationId}/>
  );
});
