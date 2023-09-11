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

import { FC } from 'react';
import * as React from 'react';
import { StepStatus } from './enum';
import { Step } from './step';
import { IUserData, StepContext } from './step_context';
interface ILogoutProps {
  userData: IUserData;
  step: StepStatus;
  setStep: React.Dispatch<React.SetStateAction<StepStatus>>;
}

export const Logout: FC<React.PropsWithChildren<ILogoutProps>> = (props) => {
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
