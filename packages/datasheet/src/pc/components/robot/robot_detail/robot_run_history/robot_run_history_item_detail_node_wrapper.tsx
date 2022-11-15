import { Box, IconButton, Tooltip, Typography, useTheme } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { WarningTriangleFilled } from '@apitable/icons';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
import { DropIcon, StyledArrowIcon } from './styled';

interface IRobotRunHistoryNodeDetail {
  index: number;
  nodeType: INodeType;
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

export const RobotRunHistoryNodeWrapper = (props: React.PropsWithChildren<IRobotRunHistoryNodeDetail>) => {
  const { nodeType, index, children, nodeDetail } = props;
  const isTrigger = index === 0;
  const theme = useTheme();
  const [showDetail, setShowDetail] = useState(false);
  const hasError = nodeDetail.errorStacks && nodeDetail.errorStacks.length > 0;
  return <Box>
    <Box
      height="24px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      marginTop={isTrigger ? '0px' : '24px'}
      style={{ cursor: 'pointer' }}
      onClick={() => setShowDetail(!showDetail)}
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <Image src={integrateCdnHost(nodeType.service.logo)} alt={nodeType.service.name} width={24} height={24} />
        <Typography variant="h7" color={theme.color.fc1} style={{ marginLeft: 8 }}>
          {nodeType.name}
        </Typography>
        {
          hasError && <Box
            marginLeft="4px"
            display="flex"
            alignItems="center"
          >
            <Tooltip content={t(Strings.robot_run_history_fail_tooltip)}>
              <Box
                as="span"
                marginLeft="4px"
                display="flex"
                alignItems="center"
              >
                <WarningTriangleFilled />
              </Box>
            </Tooltip>
          </Box>
        }
      </Box>
      <StyledArrowIcon rotated={showDetail}>
        <IconButton
          icon={DropIcon}
          onClick={() => setShowDetail(!showDetail)} />
      </StyledArrowIcon>
    </Box>
    {
      showDetail && <Box marginTop="16px">
        {children}
      </Box>
    }
  </Box>;
};
