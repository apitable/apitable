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

import { useAtomValue } from 'jotai';
import * as React from 'react';
import {
  Box, IconButton, TextButton,
  useThemeColors
} from '@apitable/components';
import { StoreActions, Strings, t } from '@apitable/core';
import { BookOutlined, CloseOutlined, ListOutlined, ShareOutlined } from '@apitable/icons';
import { automationStateAtom } from 'pc/components/automation/controller';
import {
  useAutomationResourceNode,
  useAutomationResourcePermission
} from 'pc/components/automation/controller/use_automation_permission';
import { OrEmpty } from 'pc/components/common/or_empty';
import { AutomationScenario } from 'pc/components/robot/interface';
import { useSideBarVisible } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import styles from './style.module.less';

export const MobileToolBar: React.FC<React.PropsWithChildren<{ title?: string }>> = () => {
  const colors = useThemeColors();
  const { setSideBarVisible } = useSideBarVisible();

  const nodeItem = useAutomationResourceNode();

  const permission = useAutomationResourcePermission();
  const automationState = useAtomValue(automationStateAtom);
  const dispatch = useAppDispatch();

  return (
    <Box height={'44px'} display={'flex'} alignItems={'center'} padding={'0 8px'} justifyContent={'space-between'}>
      <div
        onClick={() => {
          setSideBarVisible && setSideBarVisible(true);
        }}
        className={styles.side}
      >
        <ListOutlined size={16} color={colors.black[50]} />
      </div>

      <Box >

        <OrEmpty
          visible={permission.sharable && automationState?.scenario === AutomationScenario.node}>
          {
            nodeItem && (
              <IconButton
                component="button"
                shape="square"
                icon={() => <ShareOutlined size={16} color={nodeItem.nodeShared ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
                onClick={() => {
                  if (!automationState?.resourceId || automationState?.scenario !== AutomationScenario.node) {
                    return;
                  }

                  setSideBarVisible(false);
                  dispatch(StoreActions.updateShareModalNodeId(automationState?.resourceId));
                }}
                disabled={!permission.sharable}
                style={{ marginLeft: 8 }}
              />
            )
          }
        </OrEmpty>

        <OrEmpty visible={automationState?.scenario === AutomationScenario.node}>
          <IconButton
            component="button"
            shape="square"
            icon={() => <BookOutlined color={colors.secondLevelText} size={16}/>}
            onClick={() => {
              window.open(t(Strings.robot_help_url));
            }}
            style={{ marginLeft: 8 }}
          />
        </OrEmpty>
      </Box>

    </Box>
  );
};
