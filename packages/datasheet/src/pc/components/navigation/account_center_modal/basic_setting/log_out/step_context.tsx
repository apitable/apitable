import * as React from 'react';
import { StepStatus } from './step';

export interface IUserData {
  email: string;
  mobile?: string;
  areaCode?: string;
}

export interface IStepContext {
  step: StepStatus;
  setStep: React.Dispatch<React.SetStateAction<StepStatus>>;
  userData: IUserData;
}

export const StepContext = React.createContext({} as IStepContext);