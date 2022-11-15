import { Message } from '@apitable/components';
import { Loading } from 'pc/components/common';
import { useQuery } from 'pc/hooks';
import * as React from 'react';
import { useEffect } from 'react';

/**
 * Click on the workbench to go to the middle page of the space station
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
