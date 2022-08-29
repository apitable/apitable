import { Box, Button, Typography, useTheme } from '@vikadata/components';
import { Api, Strings, SystemConfig, t } from '@vikadata/core';
import Image from 'next/image';
import { isWecomFunc } from 'pc/components/home/social_platform';
import { useApplyOpenFunction } from 'pc/components/navigation/account_center_modal/test_function/hooks';
import { useRequest } from 'pc/hooks';
import { WECOM_ROBOT_URL } from 'pc/utils';
import ImageNoRecord from 'static/icon/datasheet/datasheet_img_modal_norecord.png';
import { useAddNewRobot, useShowRobot } from '../hooks';

export const RobotEmptyList = () => {
  const theme = useTheme();
  const {
    canAddNewRobot,
    toggleNewRobotModal,
  } = useAddNewRobot();
  const isShowRobot = useShowRobot();

  const applyOpenTestFunction = useApplyOpenFunction();

  const { data: labsFeatureListData } = useRequest(Api.getLabsFeatureList);

  const openTestFunction = () => {
    const { space: spaceLabs = [] } = labsFeatureListData!.data.data.features;
    const { url: _url, key } = spaceLabs.find(lab => lab.key === SystemConfig.test_function.robot.feature_key) || {};
    const url = key === 'robot' && isWecomFunc() ? WECOM_ROBOT_URL : _url;
    url && applyOpenTestFunction(url);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      margin="0 auto"
      marginTop="80px"
      alignItems="center"
    >
      <Image src={ImageNoRecord} alt="没有机器人哦" width={212} height={159} />
      <Typography variant="body3" color={theme.color.fc1} style={{ marginTop: 16, width: 212 }}>
        {t(Strings.robot_panel_no_robot_tip)}
      </Typography>
      <Box marginTop="24px" width="212px">
        <Button
          disabled={!canAddNewRobot}
          color="primary"
          onClick={() => isShowRobot ? canAddNewRobot && toggleNewRobotModal() : openTestFunction()}
          block
        >
          {isShowRobot ? t(Strings.robot_panel_create_tab) : t(Strings.test_function_btnmodal_btntext)}
        </Button>
        {!isShowRobot &&
          <Box marginTop="8px" fontSize="12px" lineHeight="18px" color={theme.color.fc3}>{t(Strings.test_function_form_submit_tip)}</Box>}
      </Box>
    </Box>
  );
};
