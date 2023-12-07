import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import useSWR from 'swr';
import { ResponseDataAutomationVO } from '@apitable/api-client';
import { getFieldId } from 'pc/components/automation/controller/hooks/get_field_id';
import { getRobotDetail } from 'pc/components/editors/button_editor/api';
import { IAutomationDatum } from 'pc/components/robot/interface';
import { RobotListItemCardReadOnly } from 'pc/components/robot/robot_list_item/robot_readonly_card';

export const AutomationItem: FunctionComponent<{ id: string;fieldId: string, handleDelete: () => void }> = ({ fieldId, id, handleDelete }) => {
  const { data } = useSWR(['automation_item'], () => getRobotDetail(id ?? ''));

  const router = useRouter();
  if(!(data instanceof ResponseDataAutomationVO)) {
    return null;
  }

  const respItem = data?.data;
  if (respItem ==null) {
    return null;
  }

  // @ts-ignore
  if(!respItem.triggers?.some(r => getFieldId(r)===fieldId)){
    return null;
  }

  return (
    <RobotListItemCardReadOnly
      robotCardInfo={respItem as unknown as IAutomationDatum}
      handleDelete={handleDelete}
      onNavigate={() => {
        router.push(`/workbench/${respItem?.resourceId}`);
      }}
      readonly={false}
    />
  );
};
