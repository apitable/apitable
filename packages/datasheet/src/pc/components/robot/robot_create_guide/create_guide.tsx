/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useState } from 'react';
import { Box, ModalPro as Modal } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { Steps } from 'pc/components/common';
import { useRobotContext } from '../hooks';
import { RobotCreateGuideStep1, RobotCreateGuideStep2, RobotCreateGuideStep3, RobotCreateGuideStep4 } from './robot_create_steps';

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
    },
  ];

  const goNextStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const stepComponents = [RobotCreateGuideStep1, RobotCreateGuideStep2, RobotCreateGuideStep3, RobotCreateGuideStep4];
  // const StepComponent = stepComponents[currentIndex];
  return (
    <Box width="100%" padding="24px" display="flex" alignItems="center" flexDirection="column" height="520px">
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
      {stepComponents.map((StepComponent, index) => {
        const isActive = index === currentIndex;
        return (
          <Box key={index} display={isActive ? 'block' : 'none'}>
            <StepComponent goNextStep={goNextStep} isActive={isActive} robotId={robotId} setRobotId={setRobotId} />
          </Box>
        );
      })}
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
