import { ScreenSize } from 'pc/components/common/component_display';
import { Notification } from 'pc/components/notification';
import { PrivateRoute } from 'pc/components/route_manager/private_route';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';
import { useResponsive } from 'pc/hooks';

const NotifyRouter = () => {
  const { screenIsAtLeast } = useResponsive();
  const isPC = screenIsAtLeast(ScreenSize.md);

  return (
    <>
      {isPC && (
        <PrivateRoute>
          <SideWrapper>
            <Notification />
          </SideWrapper>
        </PrivateRoute>
      )}
    </>
  );
};

export default NotifyRouter;
