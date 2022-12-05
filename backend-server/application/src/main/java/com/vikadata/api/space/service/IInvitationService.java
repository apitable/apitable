package com.vikadata.api.space.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.space.vo.SpaceLinkInfoVo;
import com.vikadata.api.space.dto.InvitationUserDTO;
import com.vikadata.entity.InvitationEntity;

public interface IInvitationService extends IService<InvitationEntity> {
    /**
     *  get space invitation base info
     * @param spaceId space id
     * @param creator member ID to create the link
     * @return SpaceLinkInfoVo
     */
    SpaceLinkInfoVo getInvitationInfo(String spaceId, Long creator);

    /**
     * follow-up actions after successful invitation
     * @param dto invitation user info
     * 
     * 
     */
    void asyncActionsForSuccessJoinSpace(InvitationUserDTO dto);

    /**
     * update member invitation status by space id
     * @param spaceId space id
     * 
     * 
     */
    void closeMemberInvitationBySpaceId(String spaceId);

    /**
     *  get member invitation token by node id
     * @param spaceId space id
     * @param memberId operator member id
     * @param nodeId link node id
     * @return link token
     * 
     * 
     */
    String getMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId);

    /**
     * create member invitation token by node id
     * @param spaceId space id
     * @param memberId operator member id
     * @param nodeId link node id
     * @return InvitationEntity
     * 
     * 
     */
    String createMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId);

    /**
     * user invites to join space station and assigns updater privileges
     * @param token invitation token
     * @param userId userID that should be added to the space station
     * @return InvitationUserDTO
     * 
     * 
     */
    InvitationUserDTO invitedUserJoinSpaceByToken(Long userId, String token);

    /**
     * check if the invitation token is valid
     * @param token invitation token
     * @param nodeId requested nodeId
     * @return InvitationEntity
     */
    InvitationEntity validInvitationToken(String token, String nodeId);

}
