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

import com.apitable.space.entity.SpaceMemberRoleRelEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * space member role relation service interface.
 */
public interface ISpaceMemberRoleRelService extends IService<SpaceMemberRoleRelEntity> {

    /**
     * creating administrator.
     *
     * @param spaceId   space id
     * @param memberIds memberIds
     * @param roleCode  roleCode
     */
    void create(String spaceId, List<Long> memberIds, String roleCode);

    /**
     * get entity by id.
     *
     * @param id member role id
     * @return SpaceMemberRoleRelEntity
     */
    SpaceMemberRoleRelEntity getEntityById(Long id);

    /**
     * change the member id of the space role.
     *
     * @param memberRoleId member role id
     * @param memberId     memberId
     */
    void updateMemberIdById(Long memberRoleId, Long memberId);

    /**
     * get member id list by resource codes in space.
     *
     * @param spaceId            space id
     * @param resourceGroupCodes resourceGroupCodes
     * @return member ids
     */
    List<Long> getMemberIdListByResourceGroupCodes(String spaceId, List<String> resourceGroupCodes);

    /**
     * get member role codes in space.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @return member ids
     */
    String getRoleCodeByMemberId(String spaceId, Long memberId);

    /**
     * get role codes in space.
     *
     * @param spaceId space id
     * @return role codes
     */
    List<String> getRoleCodesBySpaceId(String spaceId);
}
