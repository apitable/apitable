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

import { SegmentType, FieldType, t, Strings } from '@apitable/core';
import { Message } from 'pc/components/common';

export const useEnhanceTextClick = () => {
  const handleClick = (type: SegmentType | FieldType, text: string) => {
    let url = '';
    switch (type) {
      case SegmentType.Email:
      case FieldType.Email:
        url = `mailto:${text}`;
        break;
      case FieldType.Phone:
        url = `tel:${text}`;
        break;
      case SegmentType.Url:
      case FieldType.URL:
      default:
        try {
          // Verifying Address Legitimacy with URL Constructors
          const testURL = new URL(text);
          if (testURL.protocol && !/^javascript:/i.test(testURL.protocol)) {
            url = testURL.href;
          } else {
            Message.error({ content: t(Strings.message_invalid_url) });
            return;
          }
        } catch (error) {
          // No protocol header, add http protocol header by default
          try {
            const testURL = new URL(`http://${text}`);
            url = testURL.href;
          } catch (error) {
            Message.error({ content: t(Strings.message_invalid_url) });
            return;
          }
        }
    }
    if (url) {
      try {
        console.log('open:', url);
        const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
        newWindow && ((newWindow as any).opener = null);
      } catch (error) {
        Message.error({ content: t(Strings.message_invalid_url) });
      }
    } else {
      Message.error({ content: t(Strings.message_invalid_url) });
    }
  };
  return handleClick;
};
