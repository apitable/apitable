/*
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

package com.apitable.asset.enums;

import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.serializer.IBaseEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * asset upload source.
 * using: CallBack Body
 *
 * @author Pengap
 */
@Getter
@AllArgsConstructor
public enum AssetUploadSource implements IBaseEnum {

    /**
     * widget static resource.
     */
    WIDGET_STATIC(0),

    /**
     * space asset.
     */
    SPACE_ASSET(1),

    /**
     * public asset.
     */
    PUBLISH_ASSET(2),

    ;

    private final Integer value;

    /**
     * transform value to enum.
     *
     * @param value value
     * @return enum
     */
    public static AssetUploadSource of(Integer value) {
        for (AssetUploadSource type : AssetUploadSource.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("Unknown UploadSource");
    }

}
