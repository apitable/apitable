import { Button, useTheme } from '@apitable/components';
import { Api, Navigation, Strings, t } from '@apitable/core';
import { SelectOutlined } from '@apitable/icons';
import cls from 'classnames';
import { useRouter } from 'next/router';
import { Router } from 'pc/components/route_manager/router';
import { useRequest } from 'pc/hooks';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from '../components/loading';

import styles from './styles.module.less';

interface IFeishuSyncConcat {
  spaceId: string;
}

/**
 * Address Book Sync Middle Page
 */
const FeishuSyncConcat: React.FC<IFeishuSyncConcat> = (props) => {
  const theme = useTheme();
  const router = useRouter();
  const { appInstanceId } = router.query as { appInstanceId: string };
  const { spaceId } = props;
  const [complete, setComplete] = useState(false);

  const { data: result, cancel } = useRequest(() => Api.getAppInstanceById(appInstanceId!), {
    pollingInterval: 1000,
    pollingWhenHidden: false,
  });

  useEffect(() => {
    if (result) {
      const { success, data } = (result as any).data;
      if (!success || !data || (data && !data.config.profile.contactSyncDone)) {
        return;
      }
      cancel();
      setComplete(true);
    }
  }, [result, cancel]);

  const handleClick = useCallback(() => {
    Router.redirect(Navigation.WORKBENCH, {
      params: { spaceId },
    });
  }, [spaceId]);

  return (
    <div className={styles.completeWrap}>
      {
        complete ? (
          <>
            <div className={styles.completeIcon}>
              <div className={styles.completeCircle1} />
              <div className={styles.completeCircle2} />
              <div className={styles.completeCircle3}>
                <SelectOutlined size='36px' color={theme.color.fc8} />
              </div>
              {
                [1, 2, 3].map((v) => (
                  <div key={v} className={cls(styles.completeCircleGroup, styles[`completeCircleGroup${v}`])}>
                    <div className={styles.completeCircleBig} />
                    <div className={styles.completeCircleSmall} />
                  </div>
                ))
              }
            </div>
            <div className={styles.completeContent}>{t(Strings.lark_integration_sync_success)}</div>
            <Button onClick={handleClick} color='primary'>{t(Strings.lark_integration_sync_btn)}</Button>
          </>
        ) : <Loading style={{ background: theme.color.fc8 }} tip={t(Strings.lark_integration_sync_tip)} />
      }
    </div>
  );
};

export default FeishuSyncConcat;
