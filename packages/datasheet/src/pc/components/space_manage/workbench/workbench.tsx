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

import { useMount } from 'ahooks';
import { FC } from 'react';
import { Events, Player, Strings, t } from '@apitable/core';
import { ScrollBar } from 'pc/components/scroll_bar';
import { PermissionDesc } from './permission_desc';
import styles from './style.module.less';

export const Workbench: FC<React.PropsWithChildren<unknown>> = () => {
  useMount(() => {
    Player.doTrigger(Events.space_setting_workbench_shown);
  });

  return (
    <div className={styles.workbenchInSpace}>
      <ScrollBar>
        <div className={styles.scrollWrapper}>
          <h1 className={styles.pageTitle}>{t(Strings.workbench_setting)}</h1>
          <h2 className={styles.pageDesc}>{t(Strings.workbench_instruction_of_all_member_setting_and_node_permission)}</h2>
          <div className={styles.perDescWrap}>
            <PermissionDesc />
          </div>
        </div>
      </ScrollBar>
    </div>
  );
};
