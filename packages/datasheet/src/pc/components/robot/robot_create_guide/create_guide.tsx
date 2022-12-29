import { Box, ModalPro as Modal } from '@apitable/components';
import { useState } from 'react';
import { useRobotContext } from '../hooks';
import { Steps } from 'pc/components/common';
import { RobotCreateGuideStep1, RobotCreateGuideStep2, RobotCreateGuideStep3, RobotCreateGuideStep4 } from './robot_create_steps';
import { t, Strings } from '@apitable/core';

const RobotCreateGuide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [robotId, setRobotId] = useState<string | undefined>();
  const steps = [
    {
      title: t(Strings.robot_create_wizard_step_1),
    },
    {
      title: t(Strings.robot_create_wizard_step_2),
    },
    {
      title: t(Strings.robot_create_wizard_step_3),
    },
    {
      title: t(Strings.robot_create_wizard_step_4),
    }
  ];

  const goNextStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const stepComponents = [
    RobotCreateGuideStep1,
    RobotCreateGuideStep2,
    RobotCreateGuideStep3,
    RobotCreateGuideStep4,
  ];
  // const StepComponent = stepComponents[currentIndex];
  return (
    <Box
      width="100%"
      padding="24px"
      display="flex"
      alignItems="center"
      flexDirection="column"
      height="520px"
    >
      <Box marginTop="60px">
        <Steps current={currentIndex} steps={steps} onChange={setCurrentIndex} />
      </Box>
      {/* {StepComponent && (
        <Box>
          <StepComponent
            goNextStep={goNextStep}
            isActive
            robotId={robotId}
            setRobotId={setRobotId}
          />
        </Box>
      )} */}
      {
        stepComponents.map((StepComponent, index) => {
          const isActive = index === currentIndex;
          return (
            <Box
              key={index}
              display={isActive ? 'block' : 'none'}
            >
              <StepComponent
                goNextStep={goNextStep} isActive={isActive}
                robotId={robotId}
                setRobotId={setRobotId}
              />
            </Box>
          );
        })
      }
    </Box>
  );
};

export const RobotCreateGuideModal = () => {
  const { state, dispatch } = useRobotContext();
  const toggleNewRobotModal = () => {
    dispatch({ type: 'toggleNewRobotModal' });
  };
  return (
    <div>
      <Modal
        width={800}
        visible={state.isNewRobotModalOpen}
        onCancel={() => {
          if (state.isNewRobotModalOpen) {
            toggleNewRobotModal();
          }
        }}
        destroyOnClose
      >
        <RobotCreateGuide />
      </Modal>
    </div>
  );
};