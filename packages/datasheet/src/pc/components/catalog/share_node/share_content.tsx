import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cls from 'classnames';

import RcTrigger from 'rc-trigger';
import { useDebounceFn } from 'ahooks';

import { ConfigConstant, INodeRoleMap, IReduxState, StoreActions, Strings, t } from '@vikadata/core';
import { Button, stopPropagation, Typography } from '@vikadata/components';
import { InformationSmallOutlined, AddOutlined, ChevronDownOutlined, ChevronRightOutlined } from '@vikadata/icons';

import ComponentDisplay, { ScreenSize } from 'pc/components/common/component_display/component_display';
import { NodeChangeInfoType, useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { Popup } from 'pc/components/common/mobile/popup';
import { Avatar } from 'pc/components/common';
import { Tooltip } from 'pc/components/common/tooltip';

import { Select, Dropdown, ISelectItem } from './tools_components';
import { PublicShareLink } from './public_link';
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
  { label: '可管理', describe: '', value: 'management' },
  { label: '可编辑', describe: '', value: 'edit' },
  { label: '只读', describe: '', value: 'readonly' },
];

export const ShareContent: FC<IShareContentProps> = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [membersValue, setMembersValue] = useState<string[]>([]);

  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const socketData = useSelector((state: IReduxState) => state.catalogTree.socketData);
  const { getNodeRoleListReq, searchUnitReq } = useCatalogTreeRequest();
  const { run: getNodeRoleList, data: roleList } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(data.nodeId));
  const { run: searchUnit, data: searchUnitData } = useRequest<ISearchUnit>(searchUnitReq, { manual: true });
  const { run: search } = useDebounceFn(searchUnit, { wait: 100 });

  useEffect(() => {
    if (socketData && socketData.type === NodeChangeInfoType.UpdateRole) {
      getNodeRoleList();
    }
  }, [socketData]);

  useEffect(() => {
    search(keyword);
  }, [keyword]);

  const handleOpenAuth = (e) => {
    stopPropagation(e);
    if (isMobile) {
      setAuthVisible(true);
    }
  };

  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };

  const handleChange = (value: string[]) => {
    setMembersValue(value);
  };

  const renderSuffix = () => {
    const element = (
      <Typography variant='body2' className={cls(styles.shareInviteAuth, { [styles.shareInviteAuthOpen]: visible })} onClick={handleOpenAuth}>
        <span>可编辑</span>
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

  const members: ISelectItem[] = searchUnitData?.members.map((v) => {
    return {
      label: v.memberName,
      icon: <Avatar src={v.avatar} id={v.memberId} title={v.originName} />,
      value: v.memberId,
      describe: v.teams,
    };
  }) || [];

  return (
    <>
      <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
        <Typography variant='h7' className={cls(styles.shareFloor, styles.shareTitle)}>
          <span>邀请更多人加入协作</span>
          <InformationSmallOutlined />
        </Typography>
        <div className={cls(styles.shareFloor, styles.shareInvite)}>
          <Select
            wrapClassName={styles.shareInviteWrap}
            data={members}
            labelInDangerHTML
            autoWidth
            value={membersValue}
            placeholder={'请输入需要添加的成员昵称/邮箱'}
            prefix={<div className={styles.shareInvitePrefix}><AddOutlined size={16} /></div>}
            suffix={renderSuffix()}
            onSearch={handleSearch}
            dropdownFooter={<div className={styles.shareMoreInvitor}>{t(Strings.see_more)}</div>}
            onChange={handleChange}
          />
          <Button color='primary'>邀请</Button>
        </div>
        <div className={cls(styles.shareFloor, styles.collaborator)}>
          <div className={styles.collaboratorStatus} onClick={() => setDetailModalVisible(true)}>
            {roleList && (
              <div className={styles.collaboratorIcon}>
                {
                  roleList.members.slice(0, 5).map((v, i) => (
                    <div className={styles.collaboratorIconItem} style={{ marginLeft: i === 0 ? 0 : -16, zIndex: 5 - i }}>
                      <Tooltip title={v.memberName}>
                        <div>
                          <Avatar src={v.avatar} title={v.memberName} id={v.memberId} />
                        </div>
                      </Tooltip>
                    </div>
                  ))
                }
              </div>
            )}
            <Typography variant='body3' className={styles.collaboratorNumber}>
              {roleList?.members.length || 0} 位协作者
            </Typography>
          </div>
          <Typography variant='body3' className={styles.collaboratorAuth} onClick={() => dispatch(StoreActions.updatePermissionModalNodeId(data.nodeId))}>
            <span>设置权限</span>
            <ChevronRightOutlined />
          </Typography>
        </div>
        <PublicShareLink nodeId={data.nodeId} isMobile={isMobile} />
      </div>
      {detailModalVisible && roleList && <MembersDetail data={roleList} onCancel={() => setDetailModalVisible(false)} />}
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          title="设置权限"
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