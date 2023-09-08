import { Spin } from 'antd';
import { Box, deepPurple } from '@apitable/components';
import { LoadingOutlined } from '@apitable/icons';

export const WidgetLoading = () => {
  return (
    <Box width={'100%'} height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <Spin style={{ width: '100%' }} indicator={<LoadingOutlined className="circle-loading" size={16} color={deepPurple[500]} />} />
    </Box>
  );
};
