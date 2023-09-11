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

import { Tooltip } from 'antd';
import { FC } from 'react';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';

interface IComputedFieldWrapperProps {
  title: string;
  className?: string;
}

export const ComputedFieldWrapper: FC<React.PropsWithChildren<IComputedFieldWrapperProps>> = (props) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  return (
    <Tooltip trigger={isMobile ? 'click' : 'hover'} title={props.title}>
      <div className={props.className} style={{ width: '100%' }}>
        {props.children}
      </div>
    </Tooltip>
  );
};
