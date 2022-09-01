package com.vikadata.api.modular.space.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.space.model.InvitationUserDTO;
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
     * follow-up actions after successful invitation
     * @param dto invitation user info
     * @author zoe zheng
     * @date 2022/9/1 10:58
     */
    void asyncActionsForSuccessJoinSpace(InvitationUserDTO dto);

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

    /**
     * user invites to join space station and assigns updater privileges
     * @param token invitation token
     * @param userId userID that should be added to the space station
     * @return InvitationUserDTO
     * @author zoe zheng
     * @date 2022/8/31 18:17
     */
    InvitationUserDTO invitedUserJoinSpaceByToken(Long userId, String token);

}
