import { useMemo } from 'react';
import { t, Strings, isPrivateDeployment } from '@vikadata/core';
import { ILayoutProps } from '../interface';
import { Info, LevelCard, Card, MultiLineCard, CapacityWithRewardCard } from '../components';
import { Advert } from '../ui';
import { SpaceLevelInfo } from '../utils';
import { useCapacity, useApi, useFile, useRecord, useMember, useView, useOthers } from '../hooks';
import { isSocialPlatformEnabled, inSocialApp, isSocialFeiShu } from 'pc/components/home/social_platform';
import { buildSpaceCertSheetUrl } from '../components/basic_info/helper';
import { isMobileApp } from 'pc/utils/env';
import { expandCapacityRewardModal } from '../components/capacity-reward-modal/capacity-reward-modal';

interface ICardProps {
  minHeight?: string | number;
}

export const useCards = (props: ILayoutProps) => {
  const { showContextMenu, handleDelSpace, level, spaceId, spaceInfo, spaceFeatures, subscription, onUpgrade, isMobile } = props;
  const apiData = useApi({ spaceInfo, subscription });
  const capacityData = useCapacity({ spaceInfo, subscription });
  const fileData = useFile({ spaceInfo, subscription });
  const recordData = useRecord({ spaceInfo, subscription });
  const memberData = useMember({ spaceInfo, subscription });
  const viewsData = useView({ spaceInfo, subscription });
  const othersData = useOthers({ spaceInfo, subscription });
  const infoProps = useMemo(() => {
    return {
      level,
      showContextMenu,
      handleDelSpace,
    };
  }, [level, showContextMenu, handleDelSpace]);

  const { trailColor, strokeColor, hightLightColor } = useMemo(() => {
    return SpaceLevelInfo[level];
  }, [level]);

  const basicCert = useMemo(() => {
    return !!spaceFeatures && spaceFeatures.certification === 'basic';
  }, [spaceFeatures]);

  const isSocialEnabled = useMemo(() => {
    return !!spaceInfo && isSocialPlatformEnabled(spaceInfo);
  }, [spaceInfo]);

  // 是 第三方空间站 或 通过第三方浏览器打开
  const isSocial = isSocialEnabled || inSocialApp() || isSocialFeiShu();

  return useMemo(() => {
    return {
      AdCard: props => (
        <Advert
          {...props}
          desc={isSocial ? undefined : t(Strings.space_setting_social_ad_decs)}
          linkText={isSocial ? undefined : t(Strings.space_setting_social_ad_btn)}
          linkUrl={buildSpaceCertSheetUrl(spaceId)}
        />
      ),
      LevelCard: (props: ICardProps) => (
        <LevelCard {...props} isMobile={isMobile} type={level} onUpgrade={onUpgrade} deadline={subscription?.deadline} />
      ),
      InfoCard: (props: ICardProps) => (
        <Info {...props} {...infoProps} isMobile={isMobile} certified={basicCert} isSocialEnabled={isSocialEnabled} spaceId={spaceId} />
      ),
      MemberCard: (props: ICardProps) => (
        <Card
          {...props}
          {...memberData}
          isMobile={isMobile}
          level={level}
          shape="line"
          unit={t(Strings.people)}
          trailColor={trailColor}
          strokeColor={strokeColor}
          title={t(Strings.current_count_of_person)}
          titleTip={t(Strings.member_data_desc_of_member_number)}
        />
      ),

      ApiCard: (props: ICardProps) => (
        <Card
          {...props}
          {...apiData}
          isMobile={isMobile}
          shape="circle"
          unit={t(Strings.times_unit)}
          trailColor={trailColor}
          strokeColor={strokeColor}
          title={t(Strings.api_usage)}
          titleTip={t(Strings.api_usage_info)}
        />
      ),

      CapacityCard: (props: ICardProps) => {
        // 如果是第三方环境，使用 Card（不带赠送空间信息），否则使用 CapacityWithRewardCard（带赠送信息）
        return isSocial ? (
          <Card
            {...props}
            totalText={capacityData.allTotalText}
            remainText={capacityData.allRemainText}
            usedText={capacityData.allUsedText}
            usedPercent={capacityData.allUsedPercent}
            remainPercent={capacityData.allRemainPercent}
            isMobile={isMobile}
            usedTextIsFloat
            shape="circle"
            trailColor={trailColor}
            strokeColor={strokeColor}
            title={t(Strings.space_capacity)}
            titleTip={t(Strings.member_data_desc_of_appendix)}
            titleLink={
              basicCert || isSocial || isMobileApp() || isMobile || isPrivateDeployment()
                ? undefined
                : {
                    text: t(Strings.attachment_capacity_details_entry),
                    onClick: () => {
                      expandCapacityRewardModal();
                    },
                  }
            }
          />
        ) : (
          <CapacityWithRewardCard
            {...props}
            {...capacityData}
            isMobile={isMobile}
            usedTextIsFloat
            trailColor={trailColor}
            strokeColor={strokeColor}
            title={t(Strings.space_capacity)}
            titleTip={t(Strings.member_data_desc_of_appendix)}
            titleLink={
              basicCert || isSocial || isMobileApp() || isMobile || isPrivateDeployment()
                ? undefined
                : {
                    text: t(Strings.attachment_capacity_details_entry),
                    onClick: () => {
                      expandCapacityRewardModal();
                    },
                  }
            }
          />
        );
      },

      FileCard: (props: ICardProps) => (
        <Card
          {...props}
          {...fileData}
          isMobile={isMobile}
          shape="circle"
          unit={t(Strings.unit_ge)}
          trailColor={trailColor}
          strokeColor={strokeColor}
          title={t(Strings.datasheet_count)}
          titleTip={t(Strings.member_data_desc_of_field_number)}
        />
      ),

      RecordCard: (props: ICardProps) => (
        <Card
          {...props}
          {...recordData}
          isMobile={isMobile}
          shape="circle"
          unit={t(Strings.row)}
          trailColor={trailColor}
          strokeColor={strokeColor}
          title={t(Strings.total_records)}
          titleTip={t(Strings.member_data_desc_of_record_number)}
        />
      ),

      ViewsCard: (props: ICardProps) => (
        <MultiLineCard
          {...props}
          isMobile={isMobile}
          trailColor={trailColor}
          strokeColor={strokeColor}
          hightLight={hightLightColor}
          contentMargin={32}
          title={t(Strings.other_views)}
          titleTip={t(Strings.other_view_desc)}
          lines={viewsData}
        />
      ),

      OthersCard: (props: ICardProps) => (
        <MultiLineCard
          {...props}
          isMobile={isMobile}
          trailColor={trailColor}
          strokeColor={strokeColor}
          hightLight={hightLightColor}
          title={t(Strings.other_equitys)}
          titleTip={t(Strings.other_equitys_desc)}
          lines={othersData}
        />
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDelSpace, level, spaceInfo, subscription, onUpgrade]);
};
