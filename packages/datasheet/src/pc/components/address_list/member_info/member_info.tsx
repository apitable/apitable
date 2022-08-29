import { FC, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { IReduxState, ITeams, Strings, t, ConfigConstant, IMemberInfoInAddressList, isIdassPrivateDeployment } from '@vikadata/core';
import styles from './style.module.less';
import classNames from 'classnames';
import { Avatar, Tooltip, AvatarSize, ButtonPlus } from 'pc/components/common';
import EditIcon from 'static/icon/datasheet/rightclick/datasheet_icon_rename.svg';
import { useAddressRequest } from 'pc/hooks';
import { Input } from 'antd';
import { useToggle } from 'ahooks';
import parser from 'html-react-parser';
import { Identity } from 'pc/components/space_manage/identity';
import { getSocialWecomUnitName, isSocialPlatformEnabled } from 'pc/components/home/social_platform';

export const getIdentity = (memberInfo: IMemberInfoInAddressList) => {
  if(!memberInfo.isActive) return 'inactive';
  if(memberInfo.isAdmin) return 'subAdmin';
  if(memberInfo.isMainAdmin) return 'mainAdmin';
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
  const renderTeams = (teams: ITeams[] | undefined | string) => {
    if (!teams) {
      return '';
    }
    if (typeof teams === 'string') {
      return teams;
    }
    if (Array.isArray(teams) && teams.length > 0) {
      const tempTeams = teams.map(item => item.teamName);
      return tempTeams.join('<span></span>');
    }
    if (Array.isArray(teams) && teams.length === 0) {
      return user?.spaceName || '';
    }
    return '';
  };
  useEffect(() => {
    if (!user) {
      return;
    }
    const hasPerm = user.isAdmin && !user.isMainAdmin && spaceResource &&
      spaceResource.permissions.includes(ConfigConstant.PermissionCode.MEMBER);

    const isBindSocial = spaceInfo && isSocialPlatformEnabled(spaceInfo);
    if (!isBindSocial && (memberInfo.memberId === user.memberId || user.isMainAdmin || hasPerm)) {
      !editIcon && setEditIcon(true);
      return;
    }
    editIcon && setEditIcon(false);
  }, [memberInfo, editIcon, user, spaceResource, setEditIcon, spaceInfo]);

  const identity = getIdentity(memberInfo);
  const { avatar, memberId, memberName, teams, mobile, email, isMemberNameModified } = memberInfo;
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
              <Identity type={identity} className={styles.identity}/>
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
              <ButtonPlus.Icon onClick={editNameClick} className={styles.editIcon}><EditIcon fill="currentColor" /></ButtonPlus.Icon>
            }
          </div>
          {inEditName &&
            <Tooltip title={t(Strings.member_err)} placement="top" visible={nameLengthErr}>
              <Input
                defaultValue={memberName}
                className={classNames(styles.input, { [styles.err]: nameLengthErr })}
                size="small"
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
        <span className={classNames(styles.infoDetail, styles.teamInfo)}>
          {parser(renderTeams(teams)) || selectedMemberInfo.teamTitle}
        </span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoTitle}>{t(Strings.phone_number)}</span>
        <span className={classNames(styles.infoDetail, { [styles.emptyDetail]: !mobile })}>
          {mobile || '-'}
        </span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoTitle}>{t(Strings.email)}</span>
        <span className={classNames(styles.infoDetail, { [styles.emptyDetail]: !email })}>
          {email || '-'}
        </span>
      </div>
    </div>
  );
};
