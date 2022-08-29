import { Avatar, Box, Button, Select, Tooltip, useTheme } from '@vikadata/components';
import { Selectors } from '@vikadata/core';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { mutate } from 'swr';
import { createAction, getRobotBaseInfo, refreshRobotList } from '../../api';
import { getFilterActionTypes, getNodeTypeOptions } from '../../helper';
import { useActionTypes, useRobot } from '../../hooks';
import { IStepProps } from '../interface';
import robotGuideAvatar from 'static/icon/robot/robot_guide_avatar.png';
import { t, Strings } from '@vikadata/core';
// 创建 action
export const RobotCreateGuideStep3 = (props: IStepProps) => {
  const { robotId, isActive } = props;
  const { data: actionTypes, loading: actionTypesLoading } = useActionTypes();
  const { updateRobot } = useRobot(robotId);
  const [loading, setLoading] = useState(false);
  const [actionTypeId, setActionTypeId] = useState<string>('');
  const theme = useTheme();
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);

  // 当选择完 action type 后，更新机器人描述
  // const _updateRobotDescription = useCallback(async(actionTypeId: string) => {
  //   const triggerTypeId = (robot?.nodes[0] as IRobotTrigger)?.triggerTypeId;
  //   const actionType = actionTypes.find((actionType) => actionType.actionTypeId === actionTypeId);
  //   const triggerType = triggerTypes.find((triggerType) => triggerType.triggerTypeId === triggerTypeId);
  //   if (robot && actionType && triggerType) {
  //     const triggerPart = triggerType.name;
  //     const actionPart = actionType.name;

  //     const description = `${triggerPart}, ${actionPart}。`;
  //     const ok = await updateRobotDescription(robot.robotId, description);
  //     if (ok) {
  //       updateRobot({
  //         ...robot,
  //         description,
  //       });
  //     }
  //   }
  // }, [actionTypes, triggerTypes, robot, updateRobot]);

  const createRobotAction = useCallback(async(actionTypeId: string) => {
    const actionRes: any = await createAction({
      robotId: robotId!,
      actionTypeId
    });
    await mutate(`/robots/${robotId}/action`);
    const robotBaseInfo = await getRobotBaseInfo(robotId!);
    updateRobot(robotBaseInfo);
    refreshRobotList(datasheetId!);
    return actionRes.data;
  }, [robotId, updateRobot, datasheetId]);

  if (!actionTypes) {
    return null;
  }

  const handleClick = async() => {
    setLoading(true);
    await createRobotAction(actionTypeId);
    setLoading(false);
    props.goNextStep();
  };

  const handleActionTypeIdChange = (option) => {
    const actionTypeId = option.value;
    if (actionTypeId) {
      setActionTypeId(actionTypeId);
    }
  };

  // actionTypes to Select options
  const options = getNodeTypeOptions(getFilterActionTypes(actionTypes));

  return (
    <Box
      width="336px"
      margin="24px 0px 118px 0px"
    >
      <Box
        display='flex'
        height='40px'
        margin='0px 0px 40px 0px'
      >
        <Tooltip
          content={t(Strings.robot_create_wizard_step_3_desc)}
          color={theme.color.fc0}
          visible={isActive}
          style={{
            backgroundColor: theme.color.primaryColor,
          }}
          placement="right-center"
        >
          <span>
            <Avatar icon={<Image src={robotGuideAvatar} />} />
          </span>
        </Tooltip>
      </Box>
      <Box
        height="120px"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {
          !actionTypesLoading && isActive && <Select
            options={options}
            value={actionTypeId}
            onSelected={handleActionTypeIdChange}
            placeholder={t(Strings.robot_select_option)}
            defaultVisible
          />
        }
        <Button
          block
          loading={loading}
          disabled={loading || !actionTypeId}
          color="primary"
          onClick={handleClick}
          style={{
            marginTop: 40
          }}
        >
          {t(Strings.robot_create_wizard_next)}
        </Button>
      </Box>
    </Box>
  );
};
