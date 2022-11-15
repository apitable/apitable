import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { FC } from 'react';
import { Settings, Strings, t } from '@apitable/core';
import { GotoLargeOutlined } from '@apitable/icons';
import { Button, black, ContextMenu, useContextMenu } from '@apitable/components';
import styles from './style.module.less';
import { flatContextData } from 'pc/utils';

const DINGTALK_DA = 'DINGTALK_DA';

interface IDingTalkDaProps {
  suiteKey: string;
  bizAppId: string;
  corpId: string;
}

export const DingTalkDa: FC<IDingTalkDaProps> = (props) => {
  const { suiteKey, bizAppId, corpId } = props;
  const { show } = useContextMenu({ id: DINGTALK_DA });

  const linkToPublish = () => {
    const url = new URL(Settings.link_to_dingtalk_da.value);

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
    const url = new URL(Settings.link_to_dingtalk_da.value);

    url.searchParams.append('corpId', corpId);
    url.searchParams.append('ddtab', 'true');
    // url.hash = '/app-manager/1';
    // openUrlInDingtalk(url);
    navigationToUrl(url.href, { hash: '#/app-manager/1', method: Method.NewTab });
  };

  const data = flatContextData([
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
  ], true);

  return (
    <>
      <Button
        className={styles.dingTalkDaBtn}
        shape="round"
        size="small"
        prefixIcon={<GotoLargeOutlined size={16} color={black[1000]} />}
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
