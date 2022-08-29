package com.vikadata.api.modular.space.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.vo.space.SpaceLinkInfoVo;
import com.vikadata.entity.SpaceInviteLinkEntity;

/**
 * <p>
 * 工作空间-公开邀请链接 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
public interface ISpaceInviteLinkService extends IService<SpaceInviteLinkEntity> {

    /**
     * 生成或刷新链接
     *
     * @param spaceId  空间ID
     * @param teamId   部门ID
     * @param memberId 成员ID
     * @return token
     * @author Chambers
     * @date 2020/3/23
     */
    String saveOrUpdate(String spaceId, Long teamId, Long memberId);

    /**
     * 邀请链接令牌校验
     *
     * @param token 邀请链接令牌
     * @return info
     * @author Chambers
     * @date 2020/3/23
     */
    SpaceLinkInfoVo valid(String token);

    /**
     * 公开链接加入空间站
     *
     * @param userId 用户ID
     * @param token  邀请链接令牌
     * @author Chambers
     * @date 2020/3/24
     */
    void join(Long userId, String token);

    /**
     * 删除没有成员管理权限的成员生成的链接
     *
     * @param spaceId 空间ID
     * @author Chambers
     * @date 2020/3/25
     */
    void delNoPermitMemberLink(String spaceId);

    /**
     * 如果该空间全员可邀请成员的开关处于关闭，删除成员生成的链接
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @author Chambers
     * @date 2020/3/26
     */
    void delByMemberIdIfNotInvite(String spaceId, Long memberId);

    /**
     * 逻辑删除执行memberIds的邀请链接.
     * @param memberIds 成员ID列表
     */
    void deleteByMemberIds(List<Long> memberIds);

    /**
     * 删除单个部门的邀请链接
     * @param teamId 部门ID
     */
    void deleteByTeamId(Long teamId);

    /**
     * 批量删除部门的邀请链接
     * @param teamIds 部门ID列表
     */
    void deleteByTeamIds(Collection<Long> teamIds);

    /**
     * 检查是否是新用户加入空加入空间站，并发放附件容量奖励
     *
     * @param userId   用户ID
     * @param userName 用户名称
     * @param spaceId  空间ID
     * @author liuzijing
     * @date 2022/8/19
     */
    void checkIsNewUserRewardCapacity(Long userId, String userName, String spaceId);
}
