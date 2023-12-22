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

package com.apitable.workspace.service;

import com.apitable.control.infrastructure.ControlIdBuilder.ControlId;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.workspace.dto.ControlMemberDTO;
import com.apitable.workspace.vo.ControlRoleMemberVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.Map;

/**
 * control member service.
 */
public interface IControlMemberService {

    /**
     * get control role member page info.
     *
     * @param page      page
     * @param spaceId   space id
     * @param controlId control id
     * @param clz       class
     * @param <T>       T extends ControlRoleMemberVo
     * @return page info
     */
    <T extends ControlRoleMemberVo> PageInfo<T> getControlRoleMemberPageInfo(
        Page<T> page, String spaceId, ControlId controlId, Class<T> clz);

    /**
     * get member control role map.
     *
     * @param spaceId   spaceId
     * @param controlId controlId
     * @return map
     */
    Map<Long, ControlMemberDTO> getMemberControlRoleMap(String spaceId,
                                                        ControlId controlId);
}
