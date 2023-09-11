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

interface I18nProps {
  tkey: string;
  params: {
    [key: string]: React.ReactNode;
  };
}

export const TComponent: React.FC<React.PropsWithChildren<I18nProps>> = (props) => {
  const { tkey, params } = props;
  const text = tkey;

  const keys = Object.keys(params);
  if (keys.length === 0) return <>{tkey}</>;
  const startKey = keys[0];
  const keyRegx = new RegExp('\\${' + startKey + '}', 'g');
  const component = params[startKey];
  delete params[startKey];
  const segments = text.split(keyRegx);
  return (
    <>
      {segments.map((segment: string, index: number) => {
        const isPureString = !segment.includes('${');
        const showComponent = index !== segments.length - 1;
        return (
          <React.Fragment key={index}>
            {isPureString ? segment : React.createElement(TComponent, { tkey: segment, params })}
            {showComponent && component}
          </React.Fragment>
        );
      })}
    </>
  );
};
