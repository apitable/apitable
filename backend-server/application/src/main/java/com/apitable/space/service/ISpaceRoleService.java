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

import com.apitable.shared.util.page.PageInfo;
import com.apitable.space.entity.SpaceRoleEntity;
import com.apitable.space.enums.SpaceResourceGroupCode;
import com.apitable.space.ro.UpdateSpaceRoleRo;
import com.apitable.space.vo.SpaceRoleDetailVo;
import com.apitable.space.vo.SpaceRoleVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;
import java.util.function.Consumer;

/**
 * space role service interface.
 */
public interface ISpaceRoleService extends IService<SpaceRoleEntity> {

    /**
     * get space all sub admin member id list.
     *
     * @param spaceId space id.
     * @return member id list
     */
    List<Long> getSubAdminIdList(String spaceId);

    /**
     * Queries all space station administrators who have workbench administration
     * including the main administrator.
     *
     * @param spaceId space id
     * @return member ids
     */
    List<Long> getSpaceAdminsWithWorkbenchManage(String spaceId);

    /**
     * paging query administrators.
     *
     * @param spaceId space id
     * @param page    paging parameter
     * @return paging result
     */
    PageInfo<SpaceRoleVo> roleList(String spaceId, IPage<SpaceRoleVo> page);

    /**
     * creating an administrator.
     *
     * @param spaceId space id
     * @return SpaceRoleEntity
     */
    SpaceRoleEntity create(String spaceId);

    /**
     * create space role.
     *
     * @param spaceId       space id
     * @param memberIds     member id list
     * @param resourceCodes resource code list
     */
    void createRole(String spaceId, List<Long> memberIds, List<String> resourceCodes);

    /**
     * Check whether the member is not a sub-administrator in the space.
     *
     * @param spaceId  space id
     * @param memberId memberId
     */
    void checkIsNotSubAdmin(String spaceId, Long memberId);

    /**
     * Check the prerequisites for adding an administrator.
     *
     * @param spaceId  space id
     * @param memberId memberId
     */
    void checkBeforeCreate(String spaceId, Long memberId);

    /**
     * get space's sub admin info.
     *
     * @param spaceId  space id
     * @param memberId memberId
     * @return SpaceRoleDetailVo
     */
    SpaceRoleDetailVo getRoleDetail(String spaceId, Long memberId);

    /**
     * edit admin.
     *
     * @param spaceId space id
     * @param data    request parameters
     */
    void edit(String spaceId, UpdateSpaceRoleRo data);

    /**
     * delete space role.
     *
     * @param spaceId  space id
     * @param memberId memberId
     */
    void deleteRole(String spaceId, Long memberId);

    /**
     * delete space role.
     *
     * @param spaceId   space id
     * @param memberIds memberIds
     */
    void batchRemoveByMemberIds(String spaceId, List<Long> memberIds);

    /**
     * delete space sub admin.
     *
     * @param spaceId space id
     */
    void deleteBySpaceId(String spaceId);

    /**
     * get space disable resource group code if social connect.
     *
     * @param spaceId space id
     * @return SpaceResourceGroupCode list
     */
    List<SpaceResourceGroupCode> getSpaceDisableResourceCodeIfSocialConnect(String spaceId);

    /**
     * Check whether the resource permission granted to the sub-administrator contains the disabled permission.
     *
     * @param spaceId              space id
     * @param operateResourceCodes changed resource code
     */
    void checkAdminResourceChangeAllow(String spaceId, List<String> operateResourceCodes);

    /**
     * Check whether the resource permission granted to the member.
     *
     * @param spaceId       space id
     * @param memberId      member's id
     * @param resourceCodes changed resource code
     * @param consumer      the callback function
     */
    void checkCanOperate(String spaceId, Long memberId, List<String> resourceCodes,
                         Consumer<Boolean> consumer);
}
