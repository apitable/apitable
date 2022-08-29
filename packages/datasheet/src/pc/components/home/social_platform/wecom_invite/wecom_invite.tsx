import { Navigation } from '@vikadata/core';
import { Loading } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useQuery } from 'pc/hooks';
import { useEffect } from 'react';

const WecomInvite = () => {
  const navigationTo = useNavigation();
  const query = useQuery();
  const authCode = query.get('auth_code') || '';
  const suiteId = query.get('suiteid') || '';
  useEffect(() => {
    setTimeout(() => {
      navigationTo({
        path: Navigation.WECOM_SHOP_CALLBACK,
        query: {
          suiteid: suiteId,
          auth_code: authCode,
        },
      });
    }, 3000);
  }, [authCode, navigationTo, suiteId]);
  return (
    <Loading/>
  );
};

export default WecomInvite;
