package com.vikadata.api.modular.space.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.InvitationEntity;

/**
 * <p>
 *  space--invitation service interface
 * </p>
 * @author zoe zheng
 * @date 2022/8/30 15:46
 */
public interface IInvitationService extends IService<InvitationEntity> {
    /**
     * update member invitation status by space id
     * @param spaceId space id
     * @author zoe zheng
     * @date 2022/8/30 17:03
     */
    void closeMemberInvitationStatusBySpaceId(String spaceId);

    /**
     *  get member invitation token by node id
     * @param spaceId space id
     * @param memberId operator member id
     * @param nodeId link node id
     * @return link token
     * @author zoe zheng
     * @date 2022/8/30 16:10
     */
    String getMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId);

    /**
     * create member invitation token by node id
     * @param spaceId space id
     * @param memberId operator member id
     * @param nodeId link node id
     * @return InvitationEntity
     * @author zoe zheng
     * @date 2022/8/30 16:12
     */
    String createMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId);

}
