import { Box, Skeleton, useTheme } from '@vikadata/components';
import { Api, ConfigConstant, Selectors } from '@apitable/core';
import { IFormNodeItem } from 'pc/components/tool_bar/foreign_form/form_list_panel';
import { stopPropagation } from 'pc/utils';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { getResourceRobots } from '../api';
import { makeRobotCardInfo } from '../helper';
import { useActionTypes, useAddNewRobot, useRobot, useRobotContext, useTriggerTypes } from '../hooks';
import { RobotDetailForm } from '../robot_detail';
import { RobotRunHistory } from '../robot_detail/robot_run_history';
import { RobotListItemCard } from '../robot_list_item';
import { AddRobotButton } from '../robot_panel/robot_list_head';
import { RobotEmptyList } from './robot_empty_list';

export const RobotList = () => {
  const permissions = useSelector(Selectors.getPermissions);
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);
  const canManageRobot = permissions.manageable;
  const { currentRobotId, isHistory, setCurrentRobotId, updateRobotList } = useRobot();
  const thisResourceRobotUrl = `/robots?resourceId=${datasheetId}`;
  const { data: robots, error } = useSWR(thisResourceRobotUrl, getResourceRobots);
  const { data: triggerTypes, loading: triggerTypesLoading } = useTriggerTypes();
  const { data: actionTypes, loading: actionTypesLoading } = useActionTypes();

  const [formList, setFormList] = useState<IFormNodeItem[]>([]);
  const theme = useTheme();
  const { state } = useRobotContext();

  const { toggleNewRobotModal, canAddNewRobot } = useAddNewRobot();
  const fetchForeignFormList = useMemo(() => {
    return async() => {
      const res = await Api.getRelateNodeByDstId(datasheetId!, undefined, ConfigConstant.NodeType.FORM);
      const formList = res.data.data;
      setFormList(formList || []);
    };
  }, [datasheetId]);

  useEffect(() => {
    updateRobotList(robots);
  }, [robots, updateRobotList]);

  useEffect(() => {
    fetchForeignFormList();
  }, [fetchForeignFormList]);

  if (error) return null;

  if (currentRobotId) {
    if (isHistory) {
      return <RobotRunHistory />;
    }
    return (
      <RobotDetailForm
        index={(robots?.length || 0) + 1}
        datasheetId={datasheetId!}
        formList={formList}
      />
    );
  }
  if (triggerTypesLoading || actionTypesLoading || triggerTypes.length === 0 || actionTypes.length === 0) {
    return <Skeleton
      count={3}
      height="68px"
      type="text"
      circle={false}
      style={{
        marginBottom: 16,
      }}
    />;
  }

  if (state.robotList?.length === 0) {
    return <RobotEmptyList />;
  }

  return (
    <div style={{ width: '100%' }} >
      {
        state.robotList?.map((robot, index) => {
          // console.log(triggerTypes, actionTypes,robot);
          const robotCardInfo = makeRobotCardInfo(robot, triggerTypes, actionTypes);
          return (
            <RobotListItemCard
              index={index}
              key={robot.robotId}
              robotCardInfo={robotCardInfo}
              onClick={() => { setCurrentRobotId(robot.robotId); }}
              readonly={!canManageRobot}
            />
          );
        })
      }
      {
        !currentRobotId && <Box
          border={`1px solid ${theme.color.fc5}`}
          height={84}
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={16}
          onClick={() => {
            canAddNewRobot && toggleNewRobotModal();
          }}
          backgroundColor={`${theme.color.fc8}`}
          style={{
            cursor: canAddNewRobot ? 'pointer' : 'not-allowed',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={stopPropagation}
          >
            <AddRobotButton />
          </Box>
        </Box>
      }
    </div>
  );
};