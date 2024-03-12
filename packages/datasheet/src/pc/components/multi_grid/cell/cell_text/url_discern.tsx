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

import classNames from 'classnames';
import { FieldType, ISegment, string2Segment, SegmentType } from '@apitable/core';
import { useEnhanceTextClick } from 'pc/components/multi_grid/cell/hooks/use_enhance_text_click';
import { stopPropagation } from 'pc/utils';
import styles from './style.module.less';

interface IUrlDiscernProp {
  value?: string | null;
}
/**
 *
 * @param props
 * string
 * @returns
 * Splitting strings to add clickable functionality to URLs
 */
export const UrlDiscern: React.FC<React.PropsWithChildren<IUrlDiscernProp>> = (props) => {
  const { value = '' } = props;
  const getValidValue = (originValue: string | null) => {
    if (originValue) {
      let segment: ISegment[] = [];
      segment = string2Segment(originValue);
      return originValue.length ? segment : null;
    }
    return null;
  };

  // Verify URL legitimacy when clicking on links
  const _handleEnhanceTextClick = useEnhanceTextClick();
  const handleURLClick = (e: React.MouseEvent, type: SegmentType | FieldType, text: string) => {
    stopPropagation(e);
    _handleEnhanceTextClick(type, text);
  };

  return (
    <>
      {getValidValue(value)?.map((segment, index) => {
        switch (segment.type) {
          case SegmentType.Url:
            return (
              <span
                className={classNames(styles.activeUrl)}
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                key={`${segment.link}-${index}`}
                onClick={(e) => handleURLClick(e, segment.type, segment.text)}
              >
                {segment.text}
              </span>
            );
          default:
            return <span key={`${segment.text}-${index}`}>{segment.text}</span>;
        }
      })}
    </>
  );
};
