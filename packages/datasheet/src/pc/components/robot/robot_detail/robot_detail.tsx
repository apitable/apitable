
import { Box } from '@vikadata/components';
import { IFormNodeItem } from 'pc/components/tool_bar/foreign_form/form_list_panel';
import { useState, useRef } from 'react';
import { useActionTypes, useRobot, useTriggerTypes } from '../hooks';
import { IRobotTrigger } from '../interface';
import { RobotActions } from './action/robot_actions';
import { RobotBaseInfo } from './robot_base_info';
import { RobotTrigger } from './trigger/robot_trigger';

interface IRobotDetailProps {
  index: number,
  datasheetId: string,
  formList: IFormNodeItem[],
}
export const RobotDetailForm = ({ index, datasheetId, formList }: IRobotDetailProps) => {
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
    <Box
      ref={ref}
    >
      <RobotBaseInfo />
      <RobotTrigger
        robotId={robot.robotId}
        triggerTypes={triggerTypes}
        formList={formList}
        setTrigger={setTrigger}
      />
      <RobotActions
        robotId={robot.robotId}
        trigger={trigger}
        triggerTypes={triggerTypes}
        actionTypes={actionTypes}
        onScrollBottom={scrollBottom}
      />
      {/* <NodeConnectionLine nodeList={nodeList} /> */}
    </Box >
  );
};