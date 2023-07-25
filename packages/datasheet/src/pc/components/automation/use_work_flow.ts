import { useMemo, useState } from 'react';
import { Workflow } from './workflow';
import constate from 'constate';

export const useWorkflow = () => {

  const [workflowList, setWorkflowList] = useState<Workflow[]>([]);

  return useMemo(() => {
    return {
      state: {
        workflowList
      },
      api: {
        setWorkflowList
      }
    };
  }, [workflowList]);
};

const [WorkflowProvider, useWorkflowState] = constate(useWorkflow);

export { WorkflowProvider, useWorkflowState };