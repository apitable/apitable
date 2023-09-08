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

import { FC } from 'react';
import { Button, black, ContextMenu, useContextMenu } from '@apitable/components';
import { Settings, Strings, t } from '@apitable/core';
import { GotoOutlined } from '@apitable/icons';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { flatContextData } from 'pc/utils';
import styles from './style.module.less';

const DINGTALK_DA = 'DINGTALK_DA';

interface IDingTalkDaProps {
  suiteKey: string;
  bizAppId: string;
  corpId: string;
}

export const DingTalkDa: FC<React.PropsWithChildren<IDingTalkDaProps>> = (props) => {
  const { suiteKey, bizAppId, corpId } = props;
  const { show } = useContextMenu({ id: DINGTALK_DA });

  const linkToPublish = () => {
    const url = new URL(Settings.integration_dingtalk_da.value);

    url.searchParams.append('bizAppId', bizAppId);
    url.searchParams.append('suiteKey', suiteKey);
    url.searchParams.append('corpId', corpId);
    url.searchParams.append('ddtab', 'true');
    url.searchParams.append('from', t(Strings.dingtalk_da_from));
    // url.hash = '/publish';
    // openUrlInDingtalk(url);
    navigationToUrl(url.href, { hash: '#/publish', method: Method.NewTab });
  };

  const linkToAdmin = () => {
    const url = new URL(Settings.integration_dingtalk_da.value);

    url.searchParams.append('corpId', corpId);
    url.searchParams.append('ddtab', 'true');
    // url.hash = '/app-manager/1';
    // openUrlInDingtalk(url);
    navigationToUrl(url.href, { hash: '#/app-manager/1', method: Method.NewTab });
  };

  const data = flatContextData(
    [
      [
        {
          icon: <></>,
          text: t(Strings.publish_to_dingtalk_workbench),
          onClick: linkToPublish,
        },
        {
          icon: <></>,
          text: t(Strings.go_to_dingtalk_admin),
          onClick: linkToAdmin,
        },
      ],
    ],
    true,
  );

  return (
    <>
      <Button
        className={styles.dingTalkDaBtn}
        shape="round"
        size="small"
        prefixIcon={<GotoOutlined size={16} color={black[1000]} />}
        onClick={(e) => show(e)}
      >
        {t(Strings.dingtalk_da)}
      </Button>

      <ContextMenu
        menuId={DINGTALK_DA}
        overlay={data}
        // style={{
        //   width: 240,
        //   minWidth: 240,
        // }}
      />
    </>
  );
};
