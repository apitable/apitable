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
 * asset type.
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum AssetType implements IBaseEnum {

    USER_AVATAR(0),

    SPACE_LOGO(1),

    DATASHEET(2),

    COVER(3),

    NODE_DESC(4),

    DOCUMENT(5),
    ;

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }

    /**
     * transform value to enum.
     *
     * @param value value
     * @return enum
     */
    public static AssetType of(Integer value) {
        for (AssetType type : AssetType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("unknown attachment type");
    }

    public static boolean isSpaceAsset(AssetType type) {
        return type.getValue() > SPACE_LOGO.getValue();
    }

    public static boolean isPublishAsset(Integer value) {
        AssetType type = AssetType.of(value);
        return type.getValue() <= SPACE_LOGO.getValue();
    }
}
