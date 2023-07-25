import { useMemo, useState } from 'react';
import { Workflow } from './workflow';

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