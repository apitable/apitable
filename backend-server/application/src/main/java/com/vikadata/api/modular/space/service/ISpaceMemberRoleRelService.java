package com.vikadata.api.modular.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.SpaceMemberRoleRelEntity;

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
