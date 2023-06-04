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

import React, { CSSProperties } from 'react';
import { GeoStyled } from './styled';

interface ICellGeo {
    value: string | null;
    cellClassName?: string;
    cellStyle?: CSSProperties;
}

export const CellGeo = (props: ICellGeo) => {
    const { value, cellClassName, cellStyle } = props;
    console.log('CellGeo value', value);

    if (!value) {
        return null;
    }
    const handleClick = () => {
        // TODO open map
    };
    return (
        <GeoStyled className={cellClassName} style={cellStyle} onClick={handleClick}>
           {value}
        </GeoStyled>
    );
};
