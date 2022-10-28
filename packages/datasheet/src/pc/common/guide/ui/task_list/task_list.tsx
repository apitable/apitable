import { deepPurple } from '@vikadata/components';
import { Strings, t, TrackEvents } from '@apitable/core';
import { useMount } from 'ahooks';
import Image from 'next/image';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';
import { store } from 'pc/store';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage/storage';
import { tracker } from 'pc/utils/tracker';
import { FC, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import TopImg from 'static/icon/datasheet/datasheet_img_wizard_tasklist.png';
import { Model } from '../../common/model/model';
import { Guide } from '../../guide';
import { ProcessBar } from './components/process_bar';
import { ITodoItem, TodoList, TodoState } from './components/todo_list';

type IAction = IElementAction | {
  uiType: string, 
  uiConfig: string,
};

type IElementAction = {
  uiType: 'element',
  uiConfig: {
    element: string,
    emitEvent?: string, // Trigger specific events
    finishTodoWhen?: string[], // Triggers a specific event that counts as the completion of the current step
    nextActions?: IAction[], // Subsequent actions executed asynchronously after an element is clicked
  }
};

export interface IGuideTaskListProps {
  title: string,
  description: string,
  data?: Array<{
    text: string,
    stopEvents?: string[], // Add a blocking default event to the specified todo item
    actions: IAction[]
  }>
}

const uniqAndSort = (list: number[]) => {
  return [...new Set(list)].sort((a, b) => a - b);
};

// One-off event response function bindings, and bulk removal bindings.
const removeListeners: Array<() => void> = [];
const clearListeners = () => {
  removeListeners.forEach(listener => {
    listener();
  });
  removeListeners.length = 0;
};
const addOnceListener = (els: Element[], eventName: string, handler: (...args: any) => void) => {
  const fn = () => {
    removeAllListener();
    handler();
  };
  const removeAllListener = () => {
    els.forEach(el => el.removeEventListener(eventName, fn));
  };
  els.forEach(el => el.addEventListener(eventName, fn, false));
  removeListeners.push(removeAllListener);
  return removeAllListener;
};

// Clear timer (needed to switch to another action and to destroy taskList)
const timers: any[] = [];
const clearTimers = () => {
  timers.forEach(timer => {
    clearTimeout(timer);
    timers.length = 0;
  });
};

const CLASS_PREFIX = 'vika-guide-task-list';
export const TaskList: FC<IGuideTaskListProps> = (options) => {
  const { title, data = [] } = options;

  const state = store.getState();
  const { curGuideWizardId: wizardId } = state.hooks;

  const getDoneListFromLocal = () => {
    const doneListMap = getStorage(StorageName.PlayerTaskListDoneList) || {};
    return uniqAndSort(doneListMap[wizardId] || []);
  };

  const [doneList, setDoneList] = useState(getDoneListFromLocal());
  const [activeIdx, setActiveIdx] = useState(-1); // Calculate activeIdx based on doneList and originTaskList.
  const taskList: ITodoItem[] = data.map((task, index) => {
    let state: TodoState = TodoState.Empty;
    if (doneList.includes(index)) {
      state = TodoState.Done;
    } else if (index === activeIdx) {
      state = TodoState.Active;
    }
    return {
      text: task.text,
      stopEvents: task.stopEvents,
      state
    };
  });

  useMount(() => {
    tracker.track(TrackEvents.TaskListPush, {});
  });

  useEffect(() => {
    setStorage(StorageName.PlayerTaskListDoneList, {
      [wizardId]: doneList
    });
  }, [activeIdx, doneList, wizardId]);

  const finishStepAndNext = (index: number) => {
    // Complete the current step
    doneList.push(index);
    const _doneList = uniqAndSort(doneList);
    setDoneList(_doneList);
    TriggerCommands.clear_guide_uis(['breath', 'popover']);
    tracker.track(TrackEvents.TaskListComplete, {});
    // Check for full completion
    let isAllFinished = true;
    for (let i = 0; i < taskList.length; i++) {
      if (!_doneList.includes(i)) {
        isAllFinished = false;
        break;
      }
    }
    isAllFinished && finishAllTask();
  };

  const finishAllTask = () => {
    // Complete all todo
    tracker.track(TrackEvents.TaskListClose, {});
    TriggerCommands.set_wizard_completed({ wizardId });
    TriggerCommands.clear_guide_all_ui();
    setDoneList([]);
    setStorage(StorageName.PlayerTaskListDoneList, {
      [wizardId]: []
    });
  };

  // index: Index value of the current task
  const doActions = (actions: IAction[], index: number) => {
    TriggerCommands.clear_guide_uis(['breath', 'popover']);
    clearListeners();
    clearTimers();
    actions && actions.forEach(action => {
      if (action.uiType === 'element') { // Customised components not in the step table
        if (typeof action.uiConfig === 'string') {
          return;
        }
        const uiConfig = action.uiConfig;
        const els = [...document.querySelectorAll(uiConfig.element)];
        if (els.length > 0) {
          const finishTodoWhen = uiConfig.finishTodoWhen;
          if (finishTodoWhen) {
            finishTodoWhen.map((eventName) => {
              addOnceListener(els, eventName, () => {
                finishStepAndNext(index);
              });
            });
          }
          const nextActions = uiConfig.nextActions;
          if (nextActions) {
            addOnceListener(els, 'click', () => {
              const timer = setTimeout(() => {
                doActions(nextActions, index);
              }, 50);
              timers.push(timer);
            });
          }
          const emitEvent = uiConfig.emitEvent;
          if (emitEvent) {
            els.forEach(el => el[emitEvent]());
          }
        }
      } else {
        const _action = (typeof action !== 'string') ? action : JSON.stringify(action);
        Guide.showUiFromConfig(_action as any);
      }
    });
  };

  // Click on the item and set it to active
  const goAndReset = (index: number) => {
    tracker.track(TrackEvents.TaskListClick, {});
    setActiveIdx(index);
    setDoneList(uniqAndSort(doneList.filter(item => item !== index)));
    const actions = data[index].actions;
    TriggerCommands.clear_guide_uis(['breath', 'popover']);
    // Trigger action
    doActions(actions, index);
  };

  const progress = Math.floor(doneList.length * 100 / taskList.length);
  return (
    <div className={CLASS_PREFIX}>
      <Model width={358} onClick={() => {
        finishAllTask();
      }}>
        <div className="vika-guide-task-list-top">
          <Image src={TopImg} />
          <div className="title-area">
            <div className="title">{title}</div>
          </div>
        </div>
        {/* Progress */}
        <div className="vika-guide-task-list-progress">
          <div className="progress-text">
            {t(Strings.task_progress)} <span className="progress-number">{progress}%</span>
          </div>
          <ProcessBar
            strokeColor={deepPurple[500]}
            percent={progress}
          />
        </div>
        {/* todo list */}
        <div className="vika-guide-task-list-list-area">
          <TodoList list={taskList} goAndReset={goAndReset} />
        </div>
      </Model>
    </div>
  );
};

export const showTaskList = (options: IGuideTaskListProps) => {
  const render = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    root.render(
      (<TaskList {...options} />),
    );
  };

  const run = () => {
    destroyTaskList();
    render();
  };

  run();
};

export const destroyTaskList = () => {
  const destroy = () => {
    clearTimers();
    clearListeners();
    const dom = document.querySelector('.' + CLASS_PREFIX);
    const node = dom && dom.parentNode;
    node && document.body.removeChild(node);
  };
  destroy();
};
