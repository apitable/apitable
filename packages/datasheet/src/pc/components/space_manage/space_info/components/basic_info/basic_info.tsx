import { useMemo } from 'react';
import styles from './style.module.less';
import { Typography, Skeleton } from '@vikadata/components';
import { CopyOutlined } from '@vikadata/icons';
import { Strings, t, IReduxState } from '@vikadata/core';
import { Tooltip, Message } from 'pc/components/common';
import { copy2clipBoard } from 'pc/utils';
import { shallowEqual, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
export const BasicInfo = () => {
  const { spaceInfo, spaceId } = useSelector(
    (state: IReduxState) => {
      return {
        spaceInfo: state.space.curSpaceInfo,
        spaceId: state.space.activeId
      };
    }, shallowEqual
  );

  const copySuccess = () => {
    Message.success({ content: t(Strings.copy_success) });
  };

  const info = useMemo(() => {
    if (!spaceInfo) return [];

    const { creatorName, createTime, ownerName, isCreatorNameModified, isOwnerNameModified } = spaceInfo;
    const displayCreatorName = getSocialWecomUnitName({
      name: creatorName,
      isModified: isCreatorNameModified,
      spaceInfo
    });
    const displayOwnerName = getSocialWecomUnitName({
      name: ownerName,
      isModified: isOwnerNameModified,
      spaceInfo
    });

    return [
      {
        label: t(Strings.creator),
        value: (
          <Tooltip
            title={displayCreatorName}
            placement="bottomLeft"
            textEllipsis
          >
            <span className={styles.textEllipsis}>{displayCreatorName}</span>
          </Tooltip>
        ),
      },
      {
        label: t(Strings.create_date),
        value: (
          <span>
            {
              createTime &&
              dayjs(new Date(createTime)).format('YYYY-MM-DD')
            }
          </span>
        ),
      },
      {
        label: t(Strings.primary_admin),
        value: (
          <Tooltip
            title={displayOwnerName}
            placement="bottomLeft"
            textEllipsis
          >
            <span className={styles.textEllipsis}>{displayOwnerName}</span>
          </Tooltip>
        ),
      },
      {
        label: t(Strings.space_id),
        value: (
          <span className={styles.otherApp}>
            {spaceId}
            <span className={styles.copy} onClick={() => copy2clipBoard(spaceId!, copySuccess)}>
              <CopyOutlined />
            </span>
          </span>
        ),
      },
    ];
  }, [spaceId, spaceInfo]);

  if (!spaceInfo) {
    return (
      <>
        <Skeleton count={2} />
        <Skeleton width="61%"/>
      </>
    );
  }

  return (
    <div className={styles.basicInfo}>
      <div>
        {info.map((item) => (
          <Typography variant="body3" className={styles.item} key={item.label}>
            <span className={styles.label}>{item.label}：</span>
            {item.value}
          </Typography>
        ))}
      </div>
    </div>
  );
};
