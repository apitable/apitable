import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cls from 'classnames';

import RcTrigger from 'rc-trigger';
import { useDebounceFn } from 'ahooks';
import Image from 'next/image';

import { /*Api, */ConfigConstant, IInviteMemberList, INodeRoleMap, IReduxState/*, isEmail*/, StoreActions, Strings, t } from '@vikadata/core';
import { Button, stopPropagation, Typography } from '@vikadata/components';
import { InformationSmallOutlined, AddOutlined, ChevronDownOutlined, ChevronRightOutlined } from '@vikadata/icons';

import { NodeChangeInfoType, useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { execNoTraceVerification } from 'pc/utils';
import { useInviteRequest } from 'pc/hooks/use_invite_request';
import ComponentDisplay, { ScreenSize } from 'pc/components/common/component_display/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Avatar, Message } from 'pc/components/common';
import { Tooltip } from 'pc/components/common/tooltip';
import NotDataImg from 'static/icon/common/common_img_search_default.png';

import { Select, Dropdown, /*ISelectItem, Tag,  */IDropdownItem } from './tools_components';
import { PublicShareInviteLink } from './public_link';
import { MembersDetail } from '../permission_settings/permission/members_detail';

import styles from './style.module.less';

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
  isAdmin: boolean;
  isMemberNameModified: boolean;
  isNickNameModified: boolean;
  memberId: string;
  memberName: string;
  mobile: string;
  originName: string;
  teams: string;
  unitId: string;
  userId: string;
  uuid: string;
}

interface ISearchUnit {
  members: ISearchUnitMemberItem[];
}

const Permission = [
  { label: t(Strings.can_manage), describe: '', value: 'management' },
  { label: t(Strings.can_edit), describe: '', value: 'edit' },
  { label: t(Strings.can_read), describe: '', value: 'readonly' },
];

const ROOT_TEAM_ID = '0';

export const ShareContent: FC<IShareContentProps> = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [membersValue, setMembersValue] = useState<string[]>([]);
  const [memberList/*, setMemberList*/] = useState<IDropdownItem[]>([]);
  // const [extraMemberList, setExtraMemberList] = useState<IDropdownItem[]>([]);
  const [isEmpty/*, setIsEmpty*/] = useState(false);
  const [footerTip/*, setFooterTip*/] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');

  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { socketData, userInfo } = useSelector((state: IReduxState) => ({
    socketData :state.catalogTree.socketData,
    userInfo: state.user.info,
  }));
  const { getNodeRoleListReq, searchUnitReq } = useCatalogTreeRequest();
  const { generateLinkReq, linkListReq, sendInviteReq } = useInviteRequest();
  const { run: getNodeRoleList, data: roleList } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(data.nodeId));
  const { run: searchUnit/*, data: searchUnitData*/ } = useRequest<ISearchUnit>(searchUnitReq, { manual: true });
  // const { run: searchMember } = useRequest(Api.searchTeamAndMember, { manual: true });
  const { run: search } = useDebounceFn(searchUnit, { wait: 100 });
  const { run: sendInvite } = useRequest(sendInviteReq, { manual: true });

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
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  /**
   * 设置需要邀请的成员
   */
  const handleChange = (value: string[]) => {
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
   * 发送邀请邮件
   */
  const sendInviteEmail = async(nvcVal?: string) => {
    if (membersValue.length === 0) {
      return;
    }
    const waitInviteMembers: IInviteMemberList[] = [];
    for (let i = 0; i < membersValue.length; i++) {
      const val = membersValue[i];
      const member = memberList.find((item) => item.value === val);
      // 成员不存在，但是却存在值，认为是站外邮箱
      waitInviteMembers.push({ email: member?.email || val, teamId: member?.teamId || -1 });
      
    }
    const success = await sendInvite(waitInviteMembers, data.nodeId, nvcVal);
    if (success) {
      Message.success({ content: t(Strings.invite_success) });
    }
  };

  /**
   * 添加邀请
   */
  const handleAddInvitePerson = () => {
    window['nvc'] ? execNoTraceVerification(sendInviteEmail) : sendInviteEmail();
  };

  useEffect(() => {
    search(keyword);
  }, [keyword, search]);

  useEffect(() => {
    if (socketData && socketData.type === NodeChangeInfoType.UpdateRole) {
      getNodeRoleList();
    }
  }, [socketData, getNodeRoleList]);

  useEffect(() => {
    fetchInviteLinkList();
  }, [fetchInviteLinkList]);

  // useEffect(() => {
  // let memberListResult: IDropdownItem[] = [];
  // 存在搜索关键词
  // if (keyword) {
  // memberListResult = searchUnitData?.members.map((v) => {
  //   return {
  //     label: v.memberName,
  //     icon: <Avatar src={v.avatar} id={v.memberId} title={v.originName} />,
  //     value: v.memberId,
  //     describe: v.teams,
  //     email: v.email,
  //     // teamId: v.teamId,
  //   };
  // }) || [];
  // const validEmail = isEmail(keyword);

  // // 验证为邮箱，且不存在于搜索结果中
  // const canInvite = validEmail && memberListResult.findIndex((v) => v.email === keyword) < 0;
  // if (canInvite) {
  //   memberListResult.push({
  //     label: keyword,
  //     icon: <Avatar id={keyword} title={keyword} />,
  //     value: keyword,
  //     email: keyword,
  //     // teamId: -1
  //     labelTip: <Tag type='warning'>{t(Strings.pending_invite)}</Tag>,
  //   });
  // }
  // setIsEmpty(!canInvite);
  // }
  // keyword 在下拉中不存在或者为空时，检查 value 中是否存在不在搜索数据中的，不在搜索数据中的需要手动补充到 memberList 中
  // }, [keyword, searchUnitData]);

  const renderSuffix = () => {
    const element = (
      <Typography variant='body2' className={cls(styles.shareInviteAuth, { [styles.shareInviteAuthOpen]: visible })} onClick={handleOpenAuth}>
        <span>{t(Strings.can_edit)}</span>
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
          <Dropdown mode='common' data={Permission} value={['edit']} />
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
      return <div>{t(Strings.empty_email_tip)}</div>;
    }
    return <div className={styles.shareMoreInvitor}>{t(Strings.see_more)}</div>;
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
        <PublicShareInviteLink inviteLink={inviteLink} nodeId={data.nodeId} isMobile={isMobile} />
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
          <Dropdown mode='common' selectedMode="check" divide data={Permission} value={['edit']} />
        </Popup>
      </ComponentDisplay>
    </>
  );
};