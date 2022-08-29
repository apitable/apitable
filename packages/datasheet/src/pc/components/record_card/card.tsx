import { IViewColumn, Selectors } from '@vikadata/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { CardBody } from './card_body';
import { CardHeader } from './card_header';
import { useThemeColors } from '@vikadata/components';

//  相册和看板视图公用的卡片组件
interface IRecordCardProps {
  recordId: string;
  isCoverFit: boolean;
  isColNameVisible?: boolean;
  cardWidth: number;
  coverHeight: number; // 封面高度
  showEmptyCover: boolean;
  showEmptyField: boolean; // 是否显示值为空的字段，相册卡片显示等高空白占位，看板卡片不显示
  multiTextMaxLine: number; // 多行文本显示的最大行数
  datasheetId?: string;
  coverFieldId?: string;
  showOneImage?: boolean; // 看板视图只显示一张封面图
  className?: string;
  visibleFields?: IViewColumn[];
  bodyClassName?: string;
  isVirtual?: boolean; // 是否为虚拟看板
  isGallery?: boolean; // 是否为相册
}

const RecordCardBase: React.FC<IRecordCardProps> = props => {

  const {
    recordId, 
    cardWidth, 
    coverHeight = 0, 
    showEmptyField = true, 
    isCoverFit, 
    isColNameVisible, 
    coverFieldId,
    multiTextMaxLine = 6, 
    showEmptyCover = true, 
    showOneImage = false, 
    className = '',
    bodyClassName = '',
    isVirtual = false,
    isGallery = false,
  } = props;
  const colors = useThemeColors();
  const visibleFields = useSelector(Selectors.getVisibleColumns);
  const currentSearchItem = useSelector(Selectors.getCurrentSearchItem);
  let isCurrentSearchItem = false;
  if (currentSearchItem) {
    const searchRecordId = currentSearchItem;
    isCurrentSearchItem = searchRecordId === recordId;
  }
  const currentSearchItemStyle = isCurrentSearchItem ? {
    border: `1px solid ${colors.primaryColor}`,
  } : {};
  // 计算高度
  return (
    <div
      style={{
        width: cardWidth,
        ...currentSearchItemStyle,
        borderRadius: 4,
        overflow: 'hidden',        
      }}
      className={className}
    >
      <CardHeader
        showOneImage={showOneImage}
        showEmptyCover={showEmptyCover}
        recordId={recordId}
        height={coverHeight}
        width={cardWidth}
        isCoverFit={isCoverFit}
        coverFieldId={coverFieldId}
      />
      <CardBody
        recordId={recordId}
        visibleFields={props.visibleFields || visibleFields}
        showEmptyField={showEmptyField}
        isColNameVisible={isColNameVisible}
        multiTextMaxLine={multiTextMaxLine}
        className={bodyClassName}
        isVirtual={isVirtual}
        isGallery={isGallery}
      />
    </div>
  );
};

export const RecordCard = React.memo(RecordCardBase);
