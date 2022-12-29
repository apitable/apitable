package com.vikadata.api.space.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.enums.SpaceResourceGroupCode;
import com.vikadata.api.space.ro.AddSpaceRoleRo;
import com.vikadata.api.space.ro.UpdateSpaceRoleRo;
import com.vikadata.api.space.vo.SpaceRoleDetailVo;
import com.vikadata.api.space.vo.SpaceRoleVo;
import com.vikadata.entity.SpaceRoleEntity;

public interface ISpaceRoleService extends IService<SpaceRoleEntity> {

    /**
     * Queries all space station administrators who have workbench administration
     * including the main administrator
     *
     * @param spaceId space id
     * @return member ids
     */
    List<Long> getSpaceAdminsWithWorkbenchManage(String spaceId);

    /**
     * paging query administrators
     *
     * @param spaceId space id
     * @param page    paging parameter
     * @return paging result
     */
    PageInfo<SpaceRoleVo> roleList(String spaceId, IPage<SpaceRoleVo> page);

    /**
     * creating an administrator
     *
     * @param spaceId space id
     * @return SpaceRoleEntity
     */
    SpaceRoleEntity create(String spaceId);

    /**
     * create space role
     *
     * @param spaceId space id
     * @param data    request parameters
     */
    void createRole(String spaceId, AddSpaceRoleRo data);

    /**
     * Check whether the member is not a sub-administrator in the space
     *
     * @param spaceId space id
     * @param memberId memberId
     */
    void checkIsNotSubAdmin(String spaceId, Long memberId);

    /**
     * Check the prerequisites for adding an administrator
     *
     * @param spaceId space id
     * @param memberId memberId
     */
    void checkBeforeCreate(String spaceId, Long memberId);

    /**
     * get space's sub admin info
     *
     * @param spaceId space id
     * @param memberId memberId
     * @return SpaceRoleDetailVo
     */
    SpaceRoleDetailVo getRoleDetail(String spaceId, Long memberId);

    /**
     * edit admin
     *
     * @param spaceId space id
     * @param data    request parameters
     */
    void edit(String spaceId, UpdateSpaceRoleRo data);

    /**
     * delete space role
     *
     * @param spaceId space id
     * @param memberId memberId
     */
    void deleteRole(String spaceId, Long memberId);

    /**
     * delete space role
     *
     * @param spaceId space id
     * @param memberIds memberIds
     */
    void batchRemoveByMemberIds(String spaceId, List<Long> memberIds);

    /**
     * delete space sub admin
     *
     * @param spaceId space id
     */
    void deleteBySpaceId(String spaceId);

    /**
     * get space disable resource group code if social connect
     * @param spaceId space id
     * @return
     */
    List<SpaceResourceGroupCode> getSpaceDisableResourceCodeIfSocialConnect(String spaceId);

    /**
     * Check whether the resource permission granted to the sub-administrator contains the disabled permission
     *
     * @param spaceId space id
     * @param operateResourceCodes changed resource code
     */
    void checkAdminResourceChangeAllow(String spaceId, List<String> operateResourceCodes);

}
