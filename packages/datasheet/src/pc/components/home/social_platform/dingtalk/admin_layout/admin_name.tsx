import { UnitTag } from 'pc/components/catalog/permission_settings/permission/select_unit_modal/unit_tag';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { useSpaceInfo } from 'pc/hooks';

interface IAdminNameProps {
  deadline: string;
  mainAdminUserName: string;
  mainAdminUserAvatar: string;
  product: string;
  spaceId: string;
  spaceName: string;
  spaceLogo: string;
  value: string;
}

export const AdminName = (props: IAdminNameProps) => {
  const { mainAdminUserAvatar, spaceId, value } = props;
  const { spaceInfo } = useSpaceInfo(spaceId);

  if (!spaceInfo) return null;

  const title = getSocialWecomUnitName({
    name: value,
    isModified: false,
    spaceInfo
  });

  return (
    <UnitTag
      unitId={spaceId}
      avatar={mainAdminUserAvatar}
      name={value}
      title={title}
      deletable={false}
    />
  );
};