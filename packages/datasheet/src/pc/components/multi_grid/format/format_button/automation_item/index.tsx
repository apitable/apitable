import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import useSWR from 'swr';
import { useAutomationNavigateController } from 'pc/components/automation/controller/controller';
import { getResourceAutomations } from 'pc/components/robot/api';
import { RobotListItemCardReadOnly } from 'pc/components/robot/robot_list_item/robot_readonly_card';

export const AutomationItem: FunctionComponent<{ id: string; handleDelete: () => void }> = ({ id, handleDelete }) => {
  const { data } = useSWR(['automation_item'], () => getResourceAutomations(id));

  const router = useRouter();
  const l = data?.[0];
  if (!l) {
    return null;
  }
  return (
    <>
      <RobotListItemCardReadOnly
        robotCardInfo={l}
        handleDelete={handleDelete}
        onNavigate={() => {
          router.push(`/workbench/${l?.resourceId}`);
          // await navigateAutomation(l.resourceId, robot.robotId);
        }}
        readonly={false}
      />
    </>
  );
};
