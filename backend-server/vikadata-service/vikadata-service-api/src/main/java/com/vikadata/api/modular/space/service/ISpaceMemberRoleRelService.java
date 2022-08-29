package com.vikadata.api.modular.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.SpaceMemberRoleRelEntity;

import java.util.List;

/**
 * <p>
 * 工作空间-角色权限关联表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface ISpaceMemberRoleRelService extends IService<SpaceMemberRoleRelEntity> {

    /**
     * 创建管理员权限
     *
     * @param spaceId   空间ID
     * @param memberIds 成员ID列表
     * @param roleCode  角色编码
     * @author Shawn Deng
     * @date 2020/2/13 21:31
     */
    void create(String spaceId, List<Long> memberIds, String roleCode);

    /**
     * 根据ID查找
     *
     * @param memberRoleId ID标识
     * @return SpaceMemberRoleRelEntity
     * @author Shawn Deng
     * @date 2020/2/19 15:26
     */
    SpaceMemberRoleRelEntity findById(Long memberRoleId);

    /**
     * 更改角色的成员ID
     *
     * @param memberRoleId ID标识
     * @param memberId     成员ID
     * @author Shawn Deng
     * @date 2020/2/19 15:59
     */
    void updateMemberIdById(Long memberRoleId, Long memberId);

    /**
     * 根据空间ID获取成员ID列表
     *
     * @param spaceId            空间ID
     * @param resourceGroupCodes 资源分组编码
     * @return 成员ID列表
     * @author zoe zheng
     * @date 2020/5/26 12:02 下午
     */
    List<Long> getMemberId(String spaceId, List<String> resourceGroupCodes);
}
