import { Message } from '@vikadata/components';
import { Loading } from 'pc/components/common';
import { useQuery } from 'pc/hooks';
import * as React from 'react';
import { useEffect } from 'react';

/**
 * 点击工作台进入空间站的中间页
 */
const FeishuCallback: React.FC = () => {
  const query = useQuery();
  const result = query.get('key');
  useEffect(() => {
    if (result) {
      Message.error({ content: result });
    }
  }, [result]);

  return <Loading />;
};

export default FeishuCallback;
