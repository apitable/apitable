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

package com.apitable.user.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * third party member type.
 */
@Getter
@AllArgsConstructor
public enum ThirdPartyMemberType {

    WECHAT_MINIAPP(0),

    WECHAT_PUBLIC_ACCOUNT(1),

    WECOM(2),

    TENCENT(3),

    DING_TALK(4),

    FEI_SHU(5);

    private int type;
}
