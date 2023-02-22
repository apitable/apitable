/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { IViewColumn, Selectors } from '@apitable/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { CardBody } from './card_body';
import { CardHeader } from './card_header';
import { useThemeColors } from '@apitable/components';

//  Common card component for Gallery and Kanban views
interface IRecordCardProps {
  recordId: string;
  isCoverFit: boolean;
  isColNameVisible?: boolean;
  cardWidth: number;
  coverHeight: number;
  showEmptyCover: boolean;
  // Whether to display the value of the empty field, the album card to display equal height blank placeholder, Kanban card does not display
  showEmptyField: boolean;
  multiTextMaxLine: number;
  datasheetId?: string;
  coverFieldId?: string;
  // Kanban view shows only one cover image
  showOneImage?: boolean;
  className?: string;
  visibleFields?: IViewColumn[];
  bodyClassName?: string;
  // Whether it is a virtual kanban
  isVirtual?: boolean;
  isGallery?: boolean;
}

const RecordCardBase: React.FC<React.PropsWithChildren<IRecordCardProps>> = props => {

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
