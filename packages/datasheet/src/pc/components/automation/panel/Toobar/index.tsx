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
  Box, TextButton,
  useThemeColors
} from '@apitable/components';
import { StoreActions, Strings, t } from '@apitable/core';
import { BookOutlined, ListOutlined, ShareOutlined } from '@apitable/icons';
import { automationStateAtom } from 'pc/components/automation/controller';
import {
  useAutomationResourceNode,
  useAutomationResourcePermission
} from 'pc/components/automation/controller/use_automation_permission';
import { OrEmpty } from 'pc/components/common/or_empty';
import { AutomationScenario } from 'pc/components/robot/interface';
import { ToolItem } from 'pc/components/tool_bar/tool_item';
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
    <Box height={'44px'} display={'flex'} alignItems={'center'}>
      <div
        onClick={() => {
          setSideBarVisible && setSideBarVisible(true);
        }}
        className={styles.side}
      >
        <ListOutlined size={16} color={colors.black[50]} />
      </div>

      <OrEmpty
        visible={permission.sharable && automationState?.scenario === AutomationScenario.node}>
        {
          nodeItem && (
            <ToolItem
              showLabel
              icon={<ShareOutlined size={16} color={nodeItem.nodeShared ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
              onClick={() => {
                if (!automationState?.resourceId || automationState?.scenario !== AutomationScenario.node) {
                  return;
                }

                setSideBarVisible(false);
                dispatch(StoreActions.updateShareModalNodeId(automationState?.resourceId));
              }}
              text={t(Strings.share)}
              disabled={!permission.sharable}
              isActive={nodeItem.nodeShared}
              className={styles.toolbarItem}
            />
          )
        }
      </OrEmpty>

      <OrEmpty visible={automationState?.scenario === AutomationScenario.node}>
        <TextButton
          onClick={() => {
            window.open(t(Strings.robot_help_url));
          }}
          prefixIcon={<BookOutlined currentColor/>} size="small">
          {t(Strings.help)}
        </TextButton>
      </OrEmpty>
    </Box>
  );
};
