import { atomWithImmer } from 'jotai-immer';

const automationTaskMap = atomWithImmer<Map<string, boolean>>(
  new Map<string, boolean>()
);
export { automationTaskMap };

