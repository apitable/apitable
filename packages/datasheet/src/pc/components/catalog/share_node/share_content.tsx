import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cls from 'classnames';

import RcTrigger from 'rc-trigger';
import Image from 'next/image';

import { Api, ConfigConstant, IInviteMemberList, INodeRoleMap, IReduxState, isEmail, Selectors, StoreActions, Strings, t } from '@vikadata/core';
import { Button, stopPropagation, Typography } from '@vikadata/components';
import { InformationSmallOutlined, AddOutlined, ChevronDownOutlined, ChevronRightOutlined } from '@vikadata/icons';

import { NodeChangeInfoType, useCatalogTreeRequest, useRequest, useResponsive/* , useSpaceRequest */ } from 'pc/hooks';
import { execNoTraceVerification, initNoTraceVerification } from 'pc/utils';
import { useInviteRequest } from 'pc/hooks/use_invite_request';
import ComponentDisplay, { ScreenSize } from 'pc/components/common/component_display/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Avatar, Message } from 'pc/components/common';
import { Tooltip } from 'pc/components/common/tooltip';
import NotDataImg from 'static/icon/common/common_img_search_default.png';

import { Select, Dropdown, ISelectItem, Tag, IDropdownItem } from './tools_components';
import { PublicShareInviteLink } from './public_link';
import { MembersDetail } from '../permission_settings/permission/members_detail';

import styles from './style.module.less';
import { useMount } from 'ahooks';

export interface IShareContentProps {
  /** 被操作节点相关的信息 */
  data: {
    nodeId: string,
    type: ConfigConstant.NodeType,
    icon: string,
    name: string,
  };
}

interface ISearchUnitMemberItem {
  avatar: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
  isMemberNameModified: boolean;
  isNickNameModified: boolean;
  name: string;
  team: string;
  type: number;
  unitId: string;
  unitRefId: string;
  userId: string;
  uuid: string;
}

interface IInviteMembers {
  unitIds: string[];
}

const ROOT_TEAM_ID = '0';

export const ShareContent: FC<IShareContentProps> = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [membersValue, setMembersValue] = useState<string[]>([]);
  const [memberList, setMemberList] = useState<ISelectItem[]>([]);
  // 使用一个额外的数组保存已选择下拉的选项，用于搜索数据回显时不丢失显示数据
  const [extraMemberList, setExtraMemberList] = useState<ISelectItem[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [footerTip, setFooterTip] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [inviteAuthType, setInviteAuthType] = useState(ConfigConstant.permission.editor);
  const [secondVerify, setSecondVerify] = useState<null | string>(null);

  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { socketData, userInfo, canEditInvite } = useSelector((state: IReduxState) => {
    const permissions = Selectors.getPermissions(state);
    return {
      socketData :state.catalogTree.socketData,
      userInfo: state.user.info,
      canEditInvite: permissions.manageable,
    };
  });
  // const { checkEmailReq } = useSpaceRequest();
  const { getNodeRoleListReq } = useCatalogTreeRequest();
  const { generateLinkReq, linkListReq, sendInviteReq, fetchTeamAndMember } = useInviteRequest();
  const { run: getNodeRoleList, data: roleList } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(data.nodeId));
  const { run: searchMember } = useRequest(fetchTeamAndMember, { manual: true });
  const { run: sendInvite } = useRequest(sendInviteReq, { manual: true });
  // const { run: checkEmail } = useRequest(checkEmailReq, { manual: true });

  /**
   * 打开邀请成员的权限弹窗
   */
  const handleOpenAuth = (e) => {
    stopPropagation(e);
    if (isMobile) {
      setAuthVisible(true);
    }
  };

  /**
   * 邀请成员搜索
   */
  const handleSearch = async(e?: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e ? e.target.value : '';
    const validEmail = isEmail(keyword);
    const result: ISearchUnitMemberItem[] = await searchMember(keyword, true);

    // 找不到该成员
    const notFoundMember = !validEmail && !result.length;
    // 需要邀请该成员
    const needInviteMember = validEmail && !result.length;

    setIsEmpty(notFoundMember);
    setFooterTip(needInviteMember);

    setMemberList((oldMemberList) => {
      if (notFoundMember) {
        return [];
      }

      const resultList: ISelectItem[] = [];

      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        resultList.push({
          label: item.name,
          icon: <Avatar src={item.avatar} id={item.uuid} title={item.name} />,
          value: item.userId,
          describe: item.team,
          email: item.email,
          unitId: item.unitId
        });
      }
      
      /**
       * 完整邮箱：
       * 1、搜索无结果，手动补充下拉数据添加至搜索结果
       * 2、搜索有结果，直接返回搜索结果
       */
      const filterIndex = oldMemberList.findIndex((v) => v.value === keyword);
      // 搜素找不到成员，但是需要邀请
      if (filterIndex < 0 && needInviteMember) {
        resultList.push({
          value: keyword,
          label: keyword.split('@')[0],
          icon: <Avatar id={keyword} title={keyword} />,
          labelTip: <Tag type='warning'>{t(Strings.pending_invite)}</Tag>,
          email: keyword,
          describe: keyword
        });
      }

      return resultList;
    });
  };

  /**
   * 设置需要邀请的成员
   */
  const handleChange = (value: string[], option: ISelectItem) => {
    const extraMemberIndex = extraMemberList.findIndex((v) => v.value === option.value);
    setExtraMemberList((oldExtraMemberList) => {
      if (extraMemberIndex < 0) {
        return [...oldExtraMemberList, option];
      }
      oldExtraMemberList.splice(extraMemberIndex, 1);
      return oldExtraMemberList;
    });
    setMembersValue(value);
  };

  /**
   * 邀请链接生成
   */
  const generateInviteLink = (token) => {
    const url = new URL(window.location.origin);
    url.pathname = '/invite/link';

    const searchParams = new URLSearchParams('');

    searchParams.append('token', token);
    userInfo?.inviteCode && searchParams.append('inviteCode', userInfo.inviteCode);
    url.search = searchParams.toString();
    setInviteLink(url.href);
  };

  /**
   * 获取新的邀请 token
   */
  const generateInviteLinkByNewToken = async() => {
    const token = await generateLinkReq(ROOT_TEAM_ID);
    generateInviteLink(token);
  };

  /**
   * 查询已经生成的邀请链接列表
   */
  const fetchInviteLinkList = async() => {
    const linkList = await linkListReq();
    if (!linkList) {
      return;
    }
    // TODO - 需要判断链接是否已经失效，失效则需要从新生成
    const generateInviteLinkItem = linkList.find((v) => v.teamId === ROOT_TEAM_ID);// 已经存在链接
    if (generateInviteLinkItem) {
      generateInviteLink(generateInviteLinkItem.token);
      return;
    }
    // 旧的链接失效后重新生成新的邀请
    generateInviteLinkByNewToken();
  };

  /**
   * 发送邀请邮件，并给角色添加表权限
   */
  const handleAddInvite = async(nvcVal?: string) => {
    if (extraMemberList.length === 0) {
      return;
    }

    // 人机验证
    if (secondVerify) {
      setSecondVerify(null);
    }

    const waitInviteMembers: IInviteMemberList[] = extraMemberList.map((v) => ({
      email: v.email,
      teamId: ROOT_TEAM_ID,
    }));
    // 发送邀请邮件
    const { success: inviteSuccess, data: inviteData } = await sendInvite(waitInviteMembers, data.nodeId, nvcVal);
    if (!inviteSuccess) {
      return;
    }

    // 添加权限
    const { data: roleData } = await Api.addRole(data.nodeId, (inviteData as IInviteMembers).unitIds, inviteAuthType);
    const { success: roleSuccess, message: roleMsg } = roleData;
    if (!roleSuccess) {
      Message.error({ content: roleMsg });
      return;
    }
    Message.success({ content: t(Strings.invite_success) });
  };

  /**
   * 添加邀请
   */
  const handleAddInvitePerson = () => {
    // TODO: 考虑是否添加此代码验证已邀请的邮箱
    // const isExist = await checkEmail(inviteEmail);
    // if (isExist) {
    //   Message.error({ content: t(Strings.invite_email_already_exist) });
    //   return;
    // }
    window['nvc'] ? execNoTraceVerification(handleAddInvite) : handleAddInvite();
  };

  /**
   * 移除选择的成员
   */
  const handleRemoveTag = (option: ISelectItem) => {
    const newValue = extraMemberList.filter((v) => v.value !== option.value).map((v) => v.value);
    handleChange(newValue, option);
  };

  const handleChangeInviteAuth = (option: IDropdownItem) => {
    setInviteAuthType(option.value);
  };
  
  useMount(() => {
    initNoTraceVerification(setSecondVerify, ConfigConstant.CaptchaIds.LOGIN);
  });

  useEffect(() => {
    secondVerify && extraMemberList.length > 0 && handleAddInvite(secondVerify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondVerify]);

  useEffect(() => {
    if (socketData && socketData.type === NodeChangeInfoType.UpdateRole) {
      getNodeRoleList();
    }
  }, [socketData, getNodeRoleList]);

  useEffect(() => {
    fetchInviteLinkList();
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const Permission: ISelectItem[] = [
    { label: t(Strings.can_manage), value: ConfigConstant.permission.manager, disabled: !canEditInvite },
    { label: t(Strings.can_edit), value: ConfigConstant.permission.editor, disabled: !canEditInvite },
    { label: t(Strings.can_read), value: ConfigConstant.permission.reader, disabled: !canEditInvite },
  ];

  const renderSuffix = () => {
    const permissionItem = Permission.find((v) => v.value === inviteAuthType);
    const element = (
      <Typography variant='body2' className={cls(styles.shareInviteAuth, { [styles.shareInviteAuthOpen]: visible })} onClick={handleOpenAuth}>
        <span>{permissionItem?.label}</span>
        <ChevronDownOutlined size={16} />
      </Typography>
    );
    if (isMobile) {
      return element;
    }
    return (
      <RcTrigger
        action="click"
        popup={(
          <Dropdown
            mode='common'
            data={Permission}
            value={[inviteAuthType]}
            onClick={handleChangeInviteAuth}
          />
        )}
        destroyPopupOnHide
        popupAlign={{
          points: ['tr', 'br'],
        }}
        popupVisible={visible}
        onPopupVisibleChange={setVisible}
        zIndex={1000}
      >
        {element}
      </RcTrigger>
    );
  };

  const renderEmpty = () => {
    if (isEmpty) {
      return (
        <div className={styles.shareInviteEmpty}>
          <Image src={NotDataImg} alt={t(Strings.no_search_result)} width={160} height={120} />
          <Typography variant="body4" className={styles.shareInviteEmptyText}>
            {t(Strings.invite_empty_tip)}
          </Typography>
        </div>
      );
    }
    return null;
  };

  const renderFooter = () => {
    if (isEmpty) {
      return null;
    }
    if (footerTip) {
      return <Typography variant="body2" className={styles.emptyEmail}>{t(Strings.empty_email_tip)}</Typography>;
    }
    return <div className={styles.shareMoreInvitor}>{t(Strings.see_more)}</div>;
  };

  const renderValue = () => {
    return extraMemberList.map((v) => {
      return (
        <Tag
          key={v.value}
          childrenInDangerHTML
          closable
          icon={v.icon}
          className={styles.shareInputTag}
          onClose={() => handleRemoveTag(v)}
        >
          {v.label}
        </Tag>
      );
    });
  };

  return (
    <>
      <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
        <Typography variant='h7' className={cls(styles.shareFloor, styles.shareTitle)}>
          <span>{t(Strings.collaborate_and_share)}</span>
          <InformationSmallOutlined />
        </Typography>
        <div className={cls(styles.shareFloor, styles.shareInvite)}>
          <Select
            wrapClassName={styles.shareInviteWrap}
            data={memberList}
            labelInDangerHTML
            autoWidth
            value={membersValue}
            placeholder={t(Strings.enter_names_or_emails)}
            prefix={<div className={styles.shareInvitePrefix}><AddOutlined size={16} /></div>}
            suffix={renderSuffix()}
            onSearch={handleSearch}
            dropdownFooter={renderFooter()}
            onChange={handleChange}
            empty={renderEmpty()}
            renderValue={renderValue}
            maxRow={2}
            visible={!visible}
          />
          <Button onClick={handleAddInvitePerson} color='primary'>{t(Strings.add)}</Button>
        </div>
        <div className={cls(styles.shareFloor, styles.collaborator)}>
          <div className={styles.collaboratorStatus} onClick={() => setDetailModalVisible(true)}>
            {roleList && (
              <div className={styles.collaboratorIcon}>
                {
                  roleList.members.slice(0, 5).map((v, i) => (
                    <div key={v.memberId} className={styles.collaboratorIconItem} style={{ marginLeft: i === 0 ? 0 : -16, zIndex: 5 - i }}>
                      <Tooltip title={v.memberName}>
                        <div><Avatar src={v.avatar} title={v.memberName} id={v.memberId} /></div>
                      </Tooltip>
                    </div>
                  ))
                }
              </div>
            )}
            <Typography variant='body3' className={styles.collaboratorNumber}>
              {t(Strings.collaborator_number, { number: roleList?.members.length })}
            </Typography>
          </div>
          <Typography
            variant='body3'
            className={styles.collaboratorAuth}
            onClick={() => dispatch(StoreActions.updatePermissionModalNodeId(data.nodeId))}
          >
            <span>{t(Strings.setting_permission)}</span>
            <ChevronRightOutlined />
          </Typography>
        </div>
        <PublicShareInviteLink inviteLink={inviteLink} nodeId={data.nodeId} isMobile={isMobile} canEditInvite={canEditInvite} />
      </div>
      {detailModalVisible && roleList && <MembersDetail data={roleList} onCancel={() => setDetailModalVisible(false)} />}
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          title={t(Strings.setting_permission)}
          visible={authVisible}
          onClose={() => setAuthVisible(false)}
          height="auto"
          destroyOnClose
          className={styles.collaboratorMobile}
        >
          <Dropdown mode='common' selectedMode="check" divide data={Permission} value={[inviteAuthType]} onClick={handleChangeInviteAuth} />
        </Popup>
      </ComponentDisplay>
    </>
  );
};