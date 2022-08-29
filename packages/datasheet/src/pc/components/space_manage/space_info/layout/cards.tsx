import { useMemo } from 'react';
import { t, Strings, isPrivateDeployment } from '@vikadata/core';
import { ILayoutProps } from '../interface';
import {
  Info,
  LevelCard,
  Card,
  MultiLineCard
} from '../components';
import { Advert } from '../ui';
import { SpaceLevelInfo } from '../utils';
import { useCapacity, useApi, useFile, useRecord, useMember, useView, useOthers } from '../hooks';
import { isSocialPlatformEnabled } from 'pc/components/home/social_platform/utils';
import { buildSpaceCertSheetUrl } from '../components/basic_info/helper';
import { isMobileApp } from 'pc/utils/env';

interface ICardProps {
  minHeight?: string | number
}

export const useCards = (props: ILayoutProps) => {
  const { showContextMenu, handleDelSpace, level, spaceId, spaceInfo, spaceFeatures, subscription, onUpgrade, isMobile } = props;
  const capacityData = useCapacity({ spaceInfo, subscription });
  const apiData = useApi({ spaceInfo, subscription });
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

  return useMemo(() => { 
    return {
      AdCard: (props) => <Advert {...props} />,
      LevelCard: (props: ICardProps) => (
        <LevelCard
          {...props}
          isMobile={isMobile}
          type={level}
          onUpgrade={onUpgrade}
          deadline={subscription?.deadline}
        />
      ),
      InfoCard: (props: ICardProps) => (
        <Info
          {...props}
          {...infoProps}
          isMobile={isMobile}
          certified={basicCert}
          isSocialEnabled={isSocialEnabled}
          spaceId={spaceId}
        />
      ),
      MemberCard: (props: ICardProps) => <Card
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
      />,

      ApiCard: (props: ICardProps) => <Card
        {...props}
        {...apiData}
        isMobile={isMobile}
        shape="circle"
        unit={t(Strings.times_unit)}
        trailColor={trailColor}
        strokeColor={strokeColor}
        title={t(Strings.api_usage)}
        titleTip={t(Strings.api_usage_info)}
      />,

      CapacityCard: (props: ICardProps) => <Card
        {...props}
        {...capacityData}
        isMobile={isMobile}
        usedTextIsFloat
        shape="circle"
        trailColor={trailColor}
        strokeColor={strokeColor}
        title={t(Strings.space_capacity)}
        titleTip={t(Strings.member_data_desc_of_appendix)}
        titleLink={(basicCert || isSocialEnabled || isMobileApp() || isPrivateDeployment()) ? undefined : {
          text: t(Strings.space_free_capacity_expansion),
          href: buildSpaceCertSheetUrl(spaceId),
        }}
      />,

      FileCard: (props: ICardProps) => <Card
        {...props}
        {...fileData}
        isMobile={isMobile}
        shape="circle"
        unit={t(Strings.unit_ge)}
        trailColor={trailColor}
        strokeColor={strokeColor}
        title={t(Strings.datasheet_count)}
        titleTip={t(Strings.member_data_desc_of_field_number)}
      />,

      RecordCard: (props: ICardProps) => <Card
        {...props}
        {...recordData}
        isMobile={isMobile}
        shape="circle"
        unit={t(Strings.row)}
        trailColor={trailColor}
        strokeColor={strokeColor}
        title={t(Strings.total_records)}
        titleTip={t(Strings.member_data_desc_of_record_number)}
      />,

      ViewsCard: (props: ICardProps) => <MultiLineCard
        {...props}
        isMobile={isMobile}
        trailColor={trailColor}
        strokeColor={strokeColor}
        hightLight={hightLightColor}
        contentMargin={32}
        title={t(Strings.other_views)}
        titleTip={t(Strings.other_view_desc)}
        lines={viewsData}
      />,

      OthersCard: (props: ICardProps) => <MultiLineCard
        {...props}
        isMobile={isMobile}
        trailColor={trailColor}
        strokeColor={strokeColor}
        hightLight={hightLightColor}
        title={t(Strings.other_equitys)}
        titleTip={t(Strings.other_equitys_desc)}
        lines={othersData}
      />

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDelSpace, level, spaceInfo, subscription, onUpgrade]);
};