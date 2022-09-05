import { FC } from 'react';
import * as React from 'react';
import { StepStatus } from './enum';
import { IUserData, StepContext } from './step_context';
import { Step } from './step';
interface ILogoutProps {
  userData: IUserData;
  step: StepStatus;
  setStep: React.Dispatch<React.SetStateAction<StepStatus>>;
}

export const Logout: FC<ILogoutProps> = props => {
  const { userData, setStep, step } = props;

  return (
    <StepContext.Provider
      value={{
        userData,
        step,
        setStep,
      }}
    >
      <Step />
    </StepContext.Provider>
  );
};
