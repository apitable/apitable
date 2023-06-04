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

import { ApiTipConstant, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { isString } from 'class-validator';
import { BaseTextField } from 'fusion/field/base.text.field';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

const lnglatRegex = /^((-?\d+\.\d+),\s*(-?\d+\.\d+))$/;

function isValidGeoValue(lnglat: string) {
    let match = lnglatRegex.exec(lnglat);
    if (!match) return false;

    if(!match?.[1])  {
        return false
    }
    if(!match?.[3])  {
        return false
    }
    const lng = +match[1];
    const lat = +match[3];

    if (lng < -180 || lng > 180) return false;
    if (lat < -90 || lat > 90) return false;

    return true;
}

@Injectable()
export class GeoField extends BaseTextField implements OnApplicationBootstrap {
    onApplicationBootstrap() {
        FieldManager.setService(GeoField.name, this);
    }
    override validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
        if (fieldValue === null) return;
        if(isString(fieldValue) && isValidGeoValue(fieldValue)) {
            return;
        }
        if (!isString(fieldValue)) {
            this.throwException(field, ApiTipConstant.api_param_geo_field_type_error, extra);
        }
    }
}
