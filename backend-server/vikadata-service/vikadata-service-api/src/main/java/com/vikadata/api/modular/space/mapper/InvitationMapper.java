package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.InvitationEntity;

public interface InvitationMapper extends BaseMapper<InvitationEntity> {
    /**
     * find by token
     * @param inviteToken invitation token
     * @return InvitationEntity
     */
    InvitationEntity selectByInviteToken(@Param("inviteToken") String inviteToken);

    /**
     * update status by space id
     *
     * @param spaceId space id
     * @param status status(0:inactivated, 1:activation)
     * @return number of rows affected
     * 
     * 
     */
    int updateStatusBySpaceIdAndNodeIdNotEmpty(@Param("spaceId") String spaceId, @Param("status") Boolean status);

    /**
     * get entity by spaceId,nodeId and memberId
     * @param spaceId spaces id
     * @param nodeId node id
     * @param memberId the creator member id
     * @return InvitationEntity
     * 
     * 
     */
    InvitationEntity selectByMemberIdAndSpaceIdAndNodeId(@Param("memberId") Long memberId,
            @Param("spaceId") String spaceId, @Param("nodeId") String nodeId);


    /**
     * Accumulate the number of successful invitees
     *
     * @param inviteToken invitation token
     * @return number of rows affected
     */
    int updateInviteNumByInviteToken(@Param("inviteToken") String inviteToken);

    /**
     * select by token and node id
     * @param inviteToken invitation token
     * @param nodeId node id
     * @return InvitationEntity
     */
    InvitationEntity selectByInviteTokenAndNodeId(@Param("inviteToken") String inviteToken,
            @Param("nodeId") String nodeId);
}
