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

import { useState, useRef } from 'react';
import { Box } from '@apitable/components';
import { IFormNodeItem } from 'pc/components/tool_bar/foreign_form/form_list_panel';
import { useActionTypes, useRobot, useTriggerTypes } from '../hooks';
import { IRobotTrigger } from '../interface';
import { RobotActions } from './action/robot_actions';
import { RobotBaseInfo } from './robot_base_info';
import { RobotTrigger } from './trigger/robot_trigger';

interface IRobotDetailProps {
  index: number;
  datasheetId: string;
  formList: IFormNodeItem[];
}
export const RobotDetailForm = ({ formList }: IRobotDetailProps) => {
  const [trigger, setTrigger] = useState<IRobotTrigger>();
  const ref = useRef<HTMLDivElement | null>(null);
  const { loading, data: actionTypes } = useActionTypes();
  const { loading: triggerTypeLoading, data: triggerTypes } = useTriggerTypes();
  const { robot } = useRobot();

  if (loading || !actionTypes || triggerTypeLoading || !triggerTypes || !robot) {
    return null;
  }

  const scrollBottom = () => {
    const scrollBox = ref.current;
    if (!scrollBox) {
      return;
    }
    const { scrollHeight, offsetHeight } = scrollBox;
    if (scrollHeight > offsetHeight) {
      scrollBox.scrollTop = scrollHeight - offsetHeight;
    }
  };

  // const nodeList = (robot.nodes || []).map((node, index) => {
  //   if (index === 0) {
  //     return node.triggerId;
  //   }
  //   return node.actionId;
  // });
  // console.log(nodeList);
  return (
    <Box ref={ref}>
      <RobotBaseInfo />
      <RobotTrigger robotId={robot.robotId} triggerTypes={triggerTypes} formList={formList} setTrigger={setTrigger} />
      <RobotActions robotId={robot.robotId} trigger={trigger} triggerTypes={triggerTypes} actionTypes={actionTypes} onScrollBottom={scrollBottom} />
      {/* <NodeConnectionLine nodeList={nodeList} /> */}
    </Box>
  );
};
