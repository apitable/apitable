import { atomWithImmer } from 'jotai-immer';

export type AutomationTaskStatus = 'running' | 'success' | 'initial';

const automationTaskMap = atomWithImmer<Map<string, AutomationTaskStatus>>(
  new Map<string, AutomationTaskStatus>()
);
export { automationTaskMap };

