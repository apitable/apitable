import { useMount } from 'ahooks';
import { Drawer } from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useQuery, useSideBarVisible } from 'pc/hooks';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CommonSide } from '../common_side';
import { Navigation } from '../navigation';
import styles from './style.module.less';

export const MobileSideBar: React.FC = () => {
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const spaceId = useSelector(state => state.space.activeId);
  const router = useRouter();
  const pathname = router.asPath;

  const matchedTemplateCentre = pathname.includes('/template');

  const query = useQuery();

  // FOLDER = 'fod',
  // DATASHEET = 'dst',
  // FORM = 'fom',
  // DASHBOARD = 'dsb',
  // MIRROR = 'mir',

  const matchedNode = RegExp('/[fod|dst|fom|dsb|mir]').test(pathname);

  // 切空间时要保持 sidebar 正常弹出,
  // 但切换的操作目前需要刷新页面,
  // 无法得到前一步的状态, 需要持久化一个 flag, 得出用户切换空间的意图
  const hasToggleSpaceIntent = localStorage.getItem('toggleSpaceId');

  // 兼容第三方登录或从其他路由跳转到节点的情况 如 `/workbench` => `/workbench/:nodeId`
  const hasOtherRouteToSpaceIntent = !matchedNode && spaceId;

  useMount(() => {
    if (
      matchedNode ||
      (hasOtherRouteToSpaceIntent && !hasToggleSpaceIntent)
    ) {
      setSideBarVisible(false);
      localStorage.removeItem('toggleSpaceId');
    }
  });

  useEffect(() => {
    if (query.has('comment')) {
      setSideBarVisible(false);
    }
  }, [query, setSideBarVisible]);

  return (
    <Drawer
      width={'80%'}
      visible={sideBarVisible}
      onClose={() => {
        setSideBarVisible(false);
      }}
      placement="left"
      closable={false}
      className={styles.mobileDrawer}
      push={{ distance: -800 }}
    >
      <div
        className={classNames(styles.mobileSideWrap, {
          [styles.matchedTemplateCentre]: matchedTemplateCentre,
        })}
      >
        {spaceId && <Navigation />}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <CommonSide />
        </div>
      </div>
    </Drawer>
  );
};
