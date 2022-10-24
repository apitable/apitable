import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { FC } from 'react';
import { Settings, Strings, t } from '@apitable/core';
import { GotoLargeOutlined } from '@vikadata/icons';
import { Button, black, ContextMenu, useContextMenu } from '@vikadata/components';
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

  // const openUrlInDingtalk = (url: URL) => {
  //   const { href, hash } = url;
  //   /**
  //    * windows 版钉钉如果是妙聚窗口用 jsapi 打开，
  //    * 非妙聚窗口从工作台打开，避免 windows 下非妙聚窗口打开新页面时出现独立窗口
  //    */
  //   if (
  //     window.navigator.userAgent.indexOf('dingtalk-win') > -1 &&
  //     href.indexOf('dingtalk://') !== 0 &&
  //     (window as any).dingtalk?.tabwindow?.isTabWindow
  //   ) {
  //     (window as any).invokeWorkbench?.({
  //       app_url: href,
  //       app_info: {},
  //     });
  //   } else {
  //     navigationToUrl(url.href, { hash, method: Method.NewTab });
  //   }
  // };

  // 发布到钉钉工作台
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

  // 前往钉钉搭低代码管理后台
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
