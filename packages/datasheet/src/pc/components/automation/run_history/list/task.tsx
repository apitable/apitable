import { useAtom } from 'jotai/react';
import { FC } from 'react';
import * as React from 'react';
import { IRobotRunHistoryItem } from '../../../robot/interface';
import { automationHistoryAtom } from '../../controller';
import { TaskItem } from './index';

export const TaskList: FC<{list: IRobotRunHistoryItem[],
  isSummary:boolean
}> = ({ list= [], isSummary }) => {

  const [, setHistoryItem] = useAtom(automationHistoryAtom);

  return (
    <>
      {
        list.map(item => {
          return(
            <TaskItem item={item} 
              isSummary={isSummary}
              key={item.taskId}
              onClick={() => {
                setHistoryItem(state => {
                  return {
                    ...state,
                    dialogVisible: true,
                    taskId: item.taskId
                  };
                });
              }}
            />
          );
        })
      }
    </>
  );
};
