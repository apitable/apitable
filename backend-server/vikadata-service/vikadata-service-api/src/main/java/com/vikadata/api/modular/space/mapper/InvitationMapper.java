package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.InvitationEntity;

/**
 * <p>
 * workbench--invitation mapper
 * </p>
 * @author zoe zheng
 * @date 2022/8/30 15:37
 */
public interface InvitationMapper extends BaseMapper<InvitationEntity> {
    /**
     * find by token
     * @param inviteToken invitation token
     * @return InvitationEntity
     * @author zoe zheng
     * @date 2022/8/31 18:23
     */
    InvitationEntity selectByInviteToken(@Param("inviteToken") String inviteToken);

    /**
     * update status by space id
     *
     * @param spaceId space id
     * @param status status(0:inactivated, 1:activation)
     * @return number of rows affected
     * @author zoe zheng
     * @date 2022/8/30 17:08
     */
    int updateStatusBySpaceIdAndNodeIdNotEmpty(@Param("spaceId") String spaceId, @Param("status") Boolean status);

    /**
     * get entity by spaceId,nodeId and memberId
     * @param spaceId spaces id
     * @param nodeId node id
     * @param memberId the creator member id
     * @return InvitationEntity
     * @author zoe zheng
     * @date 2022/8/30 16:00
     */
    InvitationEntity selectByMemberIdAndSpaceIdAndNodeId(@Param("memberId") Long memberId,
            @Param("spaceId") String spaceId, @Param("nodeId") String nodeId);


    /**
     * Accumulate the number of successful invitees
     *
     * @param inviteToken invitation token
     * @return number of rows affected
     * @author zoe zheng
     * @date 2022/9/1 10:42
     */
    int updateInviteNumByInviteToken(@Param("inviteToken") String inviteToken);
}
