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

package com.apitable.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.apitable.space.entity.SpaceMemberRoleRelEntity;

import java.util.List;

public interface ISpaceMemberRoleRelService extends IService<SpaceMemberRoleRelEntity> {

    /**
     * creating administrator
     *
     * @param spaceId space id
     * @param memberIds memberIds
     * @param roleCode  roleCode
     */
    void create(String spaceId, List<Long> memberIds, String roleCode);

    /**
     * @param memberRoleId member role id
     * @return SpaceMemberRoleRelEntity
     */
    SpaceMemberRoleRelEntity findById(Long memberRoleId);

    /**
     * change the member id of the space role
     *
     * @param memberRoleId member role id
     * @param memberId     memberId
     */
    void updateMemberIdById(Long memberRoleId, Long memberId);

    /**
     * @param spaceId space id
     * @param resourceGroupCodes resourceGroupCodes
     * @return member ids
     */
    List<Long> getMemberId(String spaceId, List<String> resourceGroupCodes);
}
