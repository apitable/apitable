import { Box, IconButton, TextButton, Tooltip, Typography, useTheme } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { AddOutlined, CloseMiddleOutlined, InformationSmallOutlined } from '@vikadata/icons';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import * as React from 'react';
import { useAddNewRobot, useShowRobot } from '../hooks';
import { IRobotHeadAddBtn } from '../interface';

export const Beta = () => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      background={theme.color.primaryLight}
      borderRadius="2px"
      padding="1px 4px"
      marginLeft="8px"
    >
      <Typography variant="h9" color={theme.color.primaryColor}>
        BETA
      </Typography>
    </Box>
  );
};

export const AddRobotButton = (props?: IRobotHeadAddBtn) => {
  const theme = useTheme();
  const {
    canAddNewRobot,
    disableTip,
    toggleNewRobotModal,
  } = useAddNewRobot();
  const isShowRobot = useShowRobot();

  const WrapperTooltip: any = canAddNewRobot ? (props?.container || React.Fragment) : Tooltip;
  const WrapperTooltipProps = canAddNewRobot ? (props?.toolTips || {}) : { placement: 'bottom-center', content: disableTip };
  const boxStyle: React.CSSProperties = props && props.style ? props.style : {};

  const icon = <AddOutlined color={theme.color.fc1} />;

  const child = (
    <Typography variant="body3" color={theme.color.fc1}>
      {t(Strings.robot_panel_create_tab)}
    </Typography>
  );

  const content = (canAddNewRobot && props?.useTextBtn) ? (
    <Box
      display="flex"
      alignItems="center"
      style={boxStyle}
    >
      <TextButton
        size="small"
        disabled={!canAddNewRobot || !isShowRobot}
        onClick={toggleNewRobotModal}
        prefixIcon={icon}
        style={props?.btnStyle}
      >
        {child}
      </TextButton>
    </Box>
  ) : (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="5px 8px"
      opacity={canAddNewRobot ? 1 : 0.5}
      style={{ cursor: canAddNewRobot ? 'pointer' : 'not-allowed', ...boxStyle }}
      onClick={() => canAddNewRobot && toggleNewRobotModal()}
    >
      {icon}
      {child}
    </Box>
  );

  return (
    <WrapperTooltip {...WrapperTooltipProps}>
      {content}
    </WrapperTooltip>
  );
};

export const RobotListHead = () => {
  const isShowRobot = useShowRobot();
  return (
    <>
      <AddRobotButton
        toolTips={{ placement: 'bottom-center', content: isShowRobot ? t(Strings.robot_panel_create_tab) : t(Strings.robot_disable_create_tooltip) }}
        container={Tooltip}
        useTextBtn
        style={{ position: 'absolute', left: 8 }}
        btnStyle={{ paddingLeft: 8, paddingRight: 8 }}
      />
      <Box display="flex" alignItems="center">
        <Typography variant="h6">
          {t(Strings.robot_panel_title)}
        </Typography>
        <Tooltip content={t(Strings.robot_panel_help_tooltip)} placement="top-center">
          <Box display="flex" alignItems="center">
            <IconButton
              shape="square"
              icon={InformationSmallOutlined} onClick={() => {
                window.open('https://vika.cn/help/manual-vika-robot/');
              }} />
          </Box>
        </Tooltip>
        <Beta />
      </Box>
      <IconButton
        shape="square"
        onClick={() => ShortcutActionManager.trigger(ShortcutActionName.ToggleRobotPanel)}
        icon={CloseMiddleOutlined}
        style={{ position: 'absolute', right: 16 }}
      />
    </>
  );
};