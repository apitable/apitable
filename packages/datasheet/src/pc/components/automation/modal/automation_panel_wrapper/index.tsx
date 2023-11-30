import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ConfigConstant, Events, Player, Strings, t } from '@apitable/core';
import { AutomationPanel } from 'pc/components/automation';
import {
  automationActionsAtom,
  automationCacheAtom, automationCurrentTriggerId,
  automationLocalMap,
  automationPanelAtom, automationStateAtom,
  automationTriggersAtom, IAutomationPanel, PanelName
} from 'pc/components/automation/controller';
import { getFieldId } from 'pc/components/automation/controller/hooks/get_field_id';
import { checkIfModified } from 'pc/components/automation/modal/step_input_compare';
import { Modal as ConfirmModal } from 'pc/components/common';
import { IRobotAction, IRobotTrigger } from 'pc/components/robot/interface';
import { useSideBarVisible } from 'pc/hooks';
import { TriggerCommands } from '../../../../../modules/shared/apphook/trigger_commands';

const CONST_ENABLE_PREVENT = true;
const CONST_KEY_AUTOM_TRAGET_PAGE = 'CONST_KEY_AUTOM_TRAGET_PAGE';
const CONST_KEY_AUTOM_TRAGET_VISIBLE = 'CONST_KEY_AUTOM_TRAGET_VISIBLE';
export const AutomationPanelWrapper: React.FC<React.PropsWithChildren<{
    automationId: string;
}>> = React.memo(({ automationId }) => {

  const setLocalState = useSetAtom(automationLocalMap);
  const [panel] = useAtom(automationPanelAtom);

  const [, setCache] = useAtom(automationCacheAtom);

  const [automationState, setAutomationState] = useAtom(automationStateAtom);
  const isClosedRef = React.useRef(false);

  const triggers = useAtomValue(automationTriggersAtom);
  const actions = useAtomValue(automationActionsAtom);

  const localMap = useAtomValue(automationLocalMap);

  const { setSideBarVisible } = useSideBarVisible();
  const router = useRouter();

  const [panelState, setAutomationPanel] = useAtom(automationPanelAtom);
  const setItem = useSetAtom(automationCurrentTriggerId);

  const [lcoalPanel, setPanel] =useState<IAutomationPanel|undefined>(undefined);

  const handle = async (url) => {
    if(!CONST_ENABLE_PREVENT) {
      return ;
    }
    if(router.asPath === url) {
      return;
    }

    setCache({
      id: automationId,
      map: localMap,
      panel: panel
    });

    const gotUrl =sessionStorage.getItem(CONST_KEY_AUTOM_TRAGET_PAGE);
    sessionStorage.removeItem(CONST_KEY_AUTOM_TRAGET_PAGE);
    if(gotUrl === url) {
      return;
    }

    if (!checkIfModified({
      triggers,
      actions
    }, localMap)) {
      return;
    }

    router.events.emit('routeChangeError');
    if (localStorage.getItem(CONST_KEY_AUTOM_TRAGET_VISIBLE) !== 'true') {
      localStorage.setItem(CONST_KEY_AUTOM_TRAGET_VISIBLE, 'true');
      router.back();
      const confirmPromise = await new Promise<boolean>((resolve) => {
        ConfirmModal.confirm({
          title: t(Strings.automation_not_save_warning_title),
          content: t(Strings.automation_not_save_warning_description),
          cancelText: t(Strings.cancel),
          okText: t(Strings.confirm),
          onOk: () => {
            setCache({

            });
            isClosedRef.current = true;
            localStorage.setItem(CONST_KEY_AUTOM_TRAGET_VISIBLE, 'false');
            router.push(url);
            setLocalState(
              new Map<string, IRobotTrigger | IRobotAction>()
            );
            sessionStorage.setItem(CONST_KEY_AUTOM_TRAGET_PAGE, url);
            resolve(true);
          },
          onCancel: () => {
            localStorage.setItem(CONST_KEY_AUTOM_TRAGET_VISIBLE, 'false');
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
    <AutomationPanel resourceId={automationId} panel={lcoalPanel}/>
  );
});
