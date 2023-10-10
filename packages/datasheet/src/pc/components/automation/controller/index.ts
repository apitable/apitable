import produce from 'immer';
import { useAtom, useAtomValue } from 'jotai/index';
import { useContext, useMemo } from 'react';
import { getResourceAutomationDetail } from '../../robot/api';
import { ShareContext } from '../../share';
import { automationStateAtom, loadableFormList } from './atoms';

export * from './atoms';
export const useAutomationController = () => {
  const [state, setAutomationAtom] = useAtom(automationStateAtom);

  const { shareInfo } = useContext(ShareContext);
  return useMemo(() => (
    {
      state: {},
      api: {
        refreshItem: async () => {
          if (state?.resourceId && state?.currentRobotId) {
            const itemDetail = await getResourceAutomationDetail(state?.resourceId, state?.currentRobotId, {
              shareId: shareInfo?.shareId
            });
            setAutomationAtom(draft => produce(draft, state => {
              if (state) {
                state.robot = itemDetail;
              }
            }));
          }
        },
        refresh: async (
          data: {
                        resourceId: string;
                        robotId: string;
                    }
        ) => {
          if (!state?.resourceId || !state?.currentRobotId) {
            return;
          }
          if (data?.resourceId && data?.robotId) {
            const itemDetail = await getResourceAutomationDetail(data?.resourceId, data?.robotId, {
              shareId: shareInfo?.shareId
            });
            setAutomationAtom(state => produce(state, draft => {
              if (draft) {
                draft.robot = itemDetail;
              }
            }));
          }
        }
      }
    }
  ), [setAutomationAtom, shareInfo?.shareId, state?.currentRobotId, state?.resourceId]);

};
export const useResourceFormList = () => {
  const formList = useAtomValue(loadableFormList);
  return useMemo(() => (
    {
      state: {
        formList: formList?.data ?? [],
      },
    }
  ), [formList]);

};
