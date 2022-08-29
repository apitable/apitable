import { PrivateRoute } from 'pc/components/route_manager/private_route';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';
import { SpaceManage } from 'pc/components/space_manage';

const ManagementRouter = ({ children })=>{
  return <PrivateRoute><SideWrapper><SpaceManage>
    {children}
  </SpaceManage></SideWrapper></PrivateRoute>;
};

export default ManagementRouter;
