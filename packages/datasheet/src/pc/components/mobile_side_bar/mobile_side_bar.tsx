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

  /**
   * When cutting space to keep the sidebar normal pop-up, 
   * but the switch operation currently needs to refresh the page, 
   * can not get the state of the previous step, need to persist a flag, 
   * to get the user's intention to switch space
   */
  const hasToggleSpaceIntent = localStorage.getItem('toggleSpaceId');

  // Compatible with third-party logins or jumps to nodes from other routes e.g. `/workbench` => `/workbench/:nodeId`
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
