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

package com.apitable.shared.cache.bean;

import java.io.Serializable;
import java.util.Set;
import lombok.Data;

/**
 * <p>
 * user in space cache.
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class UserSpaceDto implements Serializable {

    private static final long serialVersionUID = 33013620700630558L;

    private Long userId;

    private String spaceId;

    private String spaceName;

    private String spaceLogo;

    private Long memberId;

    private String memberName;

    private Long unitId;

    private boolean isMainAdmin;

    private boolean isAdmin;

    private boolean isDel;

    private Set<String> resourceCodes;

    private Set<String> resourceGroupCodes;

    private Boolean isNameModified;

    private Boolean isMemberNameModified;
}
