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

import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { IViewColumn, Selectors } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { CardBody } from './card_body';
import { CardHeader } from './card_header';

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

const RecordCardBase: React.FC<React.PropsWithChildren<IRecordCardProps>> = (props) => {
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
    datasheetId,
  } = props;
  const colors = useThemeColors();
  const visibleFields = useAppSelector(Selectors.getVisibleColumns);
  const searchRecordId = useAppSelector(Selectors.getCurrentSearchRecordId);
  let isCurrentSearchItem = false;
  if (searchRecordId) {
    isCurrentSearchItem = searchRecordId === recordId;
  }
  const currentSearchItemStyle = isCurrentSearchItem
    ? {
      border: `1px solid ${colors.primaryColor}`,
    }
    : {};

  if (!datasheetId) {
    return null;
  }

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
        datasheetId={datasheetId}
        showOneImage={showOneImage}
        showEmptyCover={showEmptyCover}
        recordId={recordId}
        height={coverHeight}
        width={cardWidth}
        isCoverFit={isCoverFit}
        coverFieldId={coverFieldId}
      />
      <CardBody
        datasheetId={datasheetId}
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
