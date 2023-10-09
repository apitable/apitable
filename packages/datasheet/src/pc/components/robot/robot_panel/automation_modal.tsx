import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import React, { memo } from 'react';
import { automationDrawerVisibleAtom } from '../../automation/controller';

export const AutomationDrawer = memo(() => {
  const [showModal, setModal] = useAtom(automationDrawerVisibleAtom);
  const AutomationModal = dynamic(() => import('../../automation/modal/drawer'), {
    ssr: false,
  });

  return (
    <>
      {showModal && (
        <AutomationModal
          onClose={() => {
            setModal(false);
          }}
        />
      )}
    </>
  );
});
