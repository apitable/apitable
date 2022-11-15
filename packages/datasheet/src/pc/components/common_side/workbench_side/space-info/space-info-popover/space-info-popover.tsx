import CorpCertifiedTag from 'pc/components/space_manage/space_info/components/basic_info/corp_certified_tag';
import { SpaceLevelInfo } from 'pc/components/space_manage/space_info/utils';
import { FC } from 'react';
import styles from './style.module.less';
import { Avatar, Tooltip } from 'pc/components/common';
import { AvatarSize, AvatarType } from 'pc/components/common/avatar';
import { shallowEqual, useSelector } from 'react-redux';
import { t, Strings } from '@apitable/core';
import { Typography } from '@apitable/components';
import { Message } from 'pc/components/common';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { CopyOutlined } from '@apitable/icons';
import { copy2clipBoard } from 'pc/utils';
import { ISpaceLevelType, LevelType } from 'pc/components/space_manage/space_info/interface';
import { isSocialPlatformEnabled } from 'pc/components/home/social_platform';

export const SpaceInfoPopover: FC = () => {
  const { spaceInfo, spaceId, userInfo, subscription, spaceFeatures } = useSelector(state => ({
    spaceInfo: state.space.curSpaceInfo,
    spaceId: state.space.activeId || '',
    userInfo: state.user.info,
    subscription: state.billing.subscription,
    spaceFeatures: state.space.spaceFeatures,
  }), shallowEqual);

  const level = (subscription ? subscription.product.toLowerCase() : LevelType.Bronze) as ISpaceLevelType;
  const { spaceLevelTag:{ label }} = SpaceLevelInfo[level] || SpaceLevelInfo.bronze;

  const basicCert = !!spaceFeatures && spaceFeatures.certification === 'basic';
  const isSocialEnabled = !!spaceInfo && isSocialPlatformEnabled(spaceInfo);

  if (!spaceInfo || !userInfo) return null;

  const { ownerName, isOwnerNameModified } = spaceInfo;
  const displayOwnerName = getSocialWecomUnitName({
    name: ownerName,
    isModified: isOwnerNameModified,
    spaceInfo
  });

  return (
    <div className={styles.spaceBaseInfoPopover}>
      <Avatar
        title={spaceInfo.spaceName}
        size={AvatarSize.Size40}
        id={userInfo.spaceId}
        src={spaceInfo.spaceLogo}
        type={AvatarType.Space}
      />
      <Tooltip
        title={spaceInfo.spaceName}
        placement='top'
        textEllipsis
      >
        <div className={styles.spaceName}>{ spaceInfo.spaceName }</div>
      </Tooltip>
      
      <div className={styles.metaInfo}>
        {label}
        <div style={{ display: userInfo.isAdmin ? undefined : 'none' }}>
          <CorpCertifiedTag
            certified={basicCert}
            isSocialEnabled={isSocialEnabled}
            spaceId={spaceId}
          />
        </div>
      </div>

      <div className={styles.sepLine} />

      <Typography variant="body3" className={styles.item}>
        <span className={styles.label}>{t(Strings.primary_admin)}：</span>
        { displayOwnerName }
      </Typography>
      <Typography variant="body3" className={styles.item}>
        <span className={styles.label}>{t(Strings.space_id)}：</span>
        { spaceId }
        <span onClick={() => copy2clipBoard(spaceId, () => Message.success({ content: t(Strings.copy_success) }))}>
          <CopyOutlined className={styles.copy} />
        </span>
      </Typography>
    </div>
  );
};
