import { Navigation } from '@apitable/core';
import { Loading } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import { useEffect } from 'react';

const WecomInvite = () => {
  const query = useQuery();
  const authCode = query.get('auth_code') || '';
  const suiteId = query.get('suiteid') || '';
  useEffect(() => {
    setTimeout(() => {
      Router.push(Navigation.WECOM_SHOP_CALLBACK, {
        query: {
          suiteid: suiteId,
          auth_code: authCode,
        },
      });
    }, 3000);
  }, [authCode, suiteId]);
  return (
    <Loading />
  );
};

export default WecomInvite;
