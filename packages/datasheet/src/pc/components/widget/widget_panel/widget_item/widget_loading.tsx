import { deepPurple } from '@apitable/components';
import { LoadingOutlined } from '@apitable/icons';
import { Spin } from 'antd';

export const WidgetLoading = () => {
  return (
    <Spin style={{ width: '100%' }} indicator={<LoadingOutlined className="circle-loading" size={16} color={deepPurple[500]} />} />
  );
};