import { getEnvVariables } from 'pc/utils/env';
import { FC, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { IReduxState, Strings, t, ConfigConstant, IMemberInfoInAddressList, isIdassPrivateDeployment } from '@apitable/core';
import styles from './style.module.less';
import classNames from 'classnames';
import { Avatar, Tooltip, AvatarSize, ButtonPlus } from 'pc/components/common';
import EditIcon from 'static/icon/datasheet/rightclick/datasheet_icon_rename.svg';
import { useAddressRequest } from 'pc/hooks';
import { Input } from 'antd';
import { useToggle } from 'ahooks';
import { Identity } from 'pc/components/space_manage/identity';
import { getSocialWecomUnitName, isSocialFeiShu, isSocialPlatformEnabled } from 'pc/components/home/social_platform';

export const getIdentity = (memberInfo: IMemberInfoInAddressList) => {
  if (!memberInfo.isActive) return 'inactive';
  if (memberInfo.isAdmin) return 'subAdmin';
  if (memberInfo.isMainAdmin) return 'mainAdmin';
  return '';
};

export const MemberInfo: FC = () => {
  const { memberInfo, selectedMemberInfo, user, spaceResource, spaceInfo } = useSelector((state: IReduxState) => ({
    memberInfo: state.addressList.memberInfo,
    selectedMemberInfo: state.addressList.selectedTeamInfo,
    user: state.user.info,
    spaceResource: state.spacePermissionManage.spaceResource,
    spaceInfo: state.space.curSpaceInfo,
  }), shallowEqual);
  const [inEditName, setInEditName] = useState(false);
  const [nameLengthErr, setNameLengthErr] = useState(false);
  const [editIcon, { set: setEditIcon }] = useToggle(false);
  const { editMemberName, editOwnMemberNameInAddress } = useAddressRequest();
  const env = getEnvVariables();
  const editNameClick = () => {
    setInEditName(true);
  };
  const onPressEnter = e => {
    if (nameLengthErr) {
      return;
    }
    setInEditName(false);
    setNameLengthErr(false);
    if (e.target.value === memberInfo.memberName || nameLengthErr) {
      return;
    }
    if (memberInfo.memberId === user!.memberId) {
      editOwnMemberNameInAddress(memberInfo.memberId, e.target.value);
    } else {
      const teamIds = memberInfo.teams ? memberInfo.teams.map(item => item.teamId) : [];
      editMemberName({ memberId: memberInfo.memberId, memberName: e.target.value, teamIds });
    }
  };
  const inputChange = e => {
    if (e.target.value.length > ConfigConstant.MEMBER_NAME_LENGTH) {
      !nameLengthErr && setNameLengthErr(true);
    } else {
      nameLengthErr && setNameLengthErr(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const hasPerm = user.isAdmin && !user.isMainAdmin && spaceResource &&
      spaceResource.permissions.includes(ConfigConstant.PermissionCode.MEMBER);

    const isBindSocial = spaceInfo && isSocialPlatformEnabled(spaceInfo) && !isSocialFeiShu(spaceInfo);
    if (!isBindSocial && (memberInfo.memberId === user.memberId || user.isMainAdmin || hasPerm)) {
      !editIcon && setEditIcon(true);
      return;
    }
    editIcon && setEditIcon(false);
  }, [memberInfo, editIcon, user, spaceResource, setEditIcon, spaceInfo]);

  const identity = getIdentity(memberInfo);
  const { avatar, memberId, memberName, mobile, email, isMemberNameModified, teamData } = memberInfo;
  const displayMemberName = getSocialWecomUnitName({
    name: memberName,
    isModified: isMemberNameModified,
    spaceInfo
  });
  
  return (
    <div className={styles.memberInfoWrapper}>
      <div className={styles.portrait}>
        <Avatar
          src={avatar}
          id={memberId}
          title={memberName || t(Strings.unnamed)}
          size={AvatarSize.Size80}
        />
      </div>
      <div className={styles.nameAndTag}>
        <div className={styles.nameName}>
          {displayMemberName}
          {
            identity &&
            <div className={styles.identityWrap}>
              <Identity type={identity} className={styles.identity} />
            </div>
          }
        </div>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoTitle}>{t(Strings.nickname_in_space_short)}</span>
        <span className={styles.infoDetail}>
          <div className={styles.nameItemContent}>
            <span>{displayMemberName}</span>
            {
              editIcon && !isIdassPrivateDeployment() &&
              <ButtonPlus.Icon onClick={editNameClick} className={styles.editIcon}><EditIcon fill='currentColor' /></ButtonPlus.Icon>
            }
          </div>
          {inEditName &&
            <Tooltip title={t(Strings.member_err)} placement='top' visible={nameLengthErr}>
              <Input
                defaultValue={memberName}
                className={classNames(styles.input, { [styles.err]: nameLengthErr })}
                size='small'
                autoFocus
                onChange={inputChange}
                onPressEnter={onPressEnter}
                onBlur={onPressEnter}
              />
            </Tooltip>
          }
        </span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoTitle}>{t(Strings.team)}</span>
        <div className={styles.infoDetail}>
          {
            teamData?.map(team => {
              return(<p className={classNames(styles.teamInfo)} key={team.teamId}>
                {team.fullHierarchyTeamName || selectedMemberInfo.teamTitle}
              </p>);
            })
          
          }
        </div>
      </div>
      {
        !env.HIDDEN_BIND_PHONE && <div className={styles.infoItem}>
          <span className={styles.infoTitle}>{t(Strings.phone_number)}</span>
          <span className={classNames(styles.infoDetail, { [styles.emptyDetail]: !mobile })}>
            {mobile || '-'}
          </span>
        </div>
      }

      <div className={styles.infoItem}>
        <span className={styles.infoTitle}>{t(Strings.email)}</span>
        <span className={classNames(styles.infoDetail, { [styles.emptyDetail]: !email })}>
          {email || '-'}
        </span>
      </div>
    </div>
  );
};
