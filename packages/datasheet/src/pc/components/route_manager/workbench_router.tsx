import { PrivateRoute } from 'pc/components/route_manager/private_route';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';
import { Workspace } from 'pc/components/workspace';

const WorkbenchRouter = () => {
 
  return <PrivateRoute><SideWrapper><Workspace /></SideWrapper></PrivateRoute>;
};

export default WorkbenchRouter;
