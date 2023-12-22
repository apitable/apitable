import dayjs from 'dayjs';
import { useAtom } from 'jotai/react';
import { FC } from 'react';
import * as React from 'react';
import { IRunHistoryDatum } from '../../../robot/robot_detail/robot_run_history';
import { automationHistoryAtom } from '../../controller';
import { TaskItem } from './index';

export const TaskList: FC<{ list:IRunHistoryDatum []; isSummary: boolean,
  activeId?:string
}> = ({ list = [], isSummary, activeId }) => {
  const [, setHistoryItem] = useAtom(automationHistoryAtom);

  const sortedList = list.sort((a, b) => dayjs.tz(a.createdAt).isBefore(b.createdAt) ? 1 : -1);

  return (
    <>
      {sortedList.map((item) => {
        return (
          <TaskItem
            item={item}
            activeId={activeId}
            isSummary={isSummary}
            key={item.taskId}
            onClick={() => {
              setHistoryItem((state) => {
                return {
                  ...state,
                  dialogVisible: true,
                  taskId: item.taskId,
                };
              });
            }}
          />
        );
      })}
    </>
  );
};
