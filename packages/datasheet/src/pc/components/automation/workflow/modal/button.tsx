import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const WorkflowModal = dynamic(() => import('./modal'), { ssr: false });

export const WorkflowEntryButton = () => {

  const [show, setShow] = useState(false);
  return (

    <>
      <button onClick={() => setShow(true)}>lazy load workflow </button>
      {
        show && (
          <WorkflowModal />
        )
      }
    </>
  );

};
