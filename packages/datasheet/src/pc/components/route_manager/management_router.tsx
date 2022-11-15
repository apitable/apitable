import { Skeleton } from '@apitable/components';
import dynamic from 'next/dynamic';
import { PrivateRoute } from 'pc/components/route_manager/private_route';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';

const SpaceManage = dynamic(() => import('pc/components/space_manage/space_manage'), {
  ssr: false,
  loading: () => (
    <div>
      <Skeleton count={1} width="38%" />
      <Skeleton count={2} />
      <Skeleton count={1} width="61%"/>
    </div>
  ),
});

const ManagementRouter = ({ children })=>{
  return <PrivateRoute><SideWrapper><SpaceManage>
    {children}
  </SpaceManage></SideWrapper></PrivateRoute>;
};

export default ManagementRouter;
