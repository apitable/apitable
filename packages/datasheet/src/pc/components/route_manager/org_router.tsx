import { AddressList } from 'pc/components/address_list';
import { PrivateRoute } from 'pc/components/route_manager/private_route';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';

const OrgRouter = () => {
  return <PrivateRoute><SideWrapper><AddressList /></SideWrapper></PrivateRoute>;
};

export default OrgRouter;
