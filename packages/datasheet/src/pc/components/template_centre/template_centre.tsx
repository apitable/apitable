import { Events, IReduxState, Player } from '@vikadata/core';
import { useMount } from 'ahooks';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';
import { usePageParams, useQuery, useRequest, useUserRequest } from 'pc/hooks';
import { useWecomContact } from 'pc/hooks/use_wecom_contact';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { isDingtalkSkuPage } from '../home/social_platform';
import { MobileSideBar } from '../mobile_side_bar';
import styles from './style.module.less';
import cls from 'classnames';

const TemplateCentre: FC = props => {
  const { getLoginStatusReq } = useUserRequest();
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const { run: getLoginStatus, loading } = useRequest(getLoginStatusReq, { manual: true });
  const query = useQuery();
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage(purchaseToken);
  usePageParams();
  useWecomContact();

  useMount(() => {
    if (!spaceId) {
      getLoginStatus();
    }
    Player.doTrigger(Events.template_center_shown);
  });

  if (loading) {
    return null;
  }

  return spaceId ? (
    <SideWrapper>
      <div className={styles.bg} data-height="20px" />
      <div className={cls(styles.templateCentre, styles.wrapper)}>{props.children}</div>
    </SideWrapper>
  ) : (
    <>
      {!isSkuPage && (
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileSideBar />
        </ComponentDisplay>
      )}
      <div className={styles.templateCentre}>{props.children}</div>
    </>
  );
};

export default TemplateCentre;
