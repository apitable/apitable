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

package com.apitable.space.mapper;

import com.apitable.space.entity.InvitationEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * invitation mapper.
 */
public interface InvitationMapper extends BaseMapper<InvitationEntity> {

    /**
     * query by token.
     *
     * @param inviteToken invitation token
     * @return InvitationEntity
     */
    InvitationEntity selectByInviteToken(@Param("inviteToken") String inviteToken);

    /**
     * update status by space id.
     *
     * @param spaceId space id
     * @param status  status(0:inactivated, 1:activation)
     * @return number of rows affected
     */
    int updateStatusBySpaceIdAndNodeIdNotEmpty(@Param("spaceId") String spaceId,
                                               @Param("status") Boolean status);

    /**
     * get entity by spaceId,nodeId and memberId.
     *
     * @param spaceId  spaces id
     * @param nodeId   node id
     * @param memberId the creator member id
     * @return InvitationEntity
     */
    InvitationEntity selectByMemberIdAndSpaceIdAndNodeId(@Param("memberId") Long memberId,
                                                         @Param("spaceId") String spaceId,
                                                         @Param("nodeId") String nodeId);


    /**
     * Accumulate the number of successful invitees.
     *
     * @param inviteToken invitation token
     * @return number of rows affected
     */
    int updateInviteNumByInviteToken(@Param("inviteToken") String inviteToken);

    /**
     * select by token and node id.
     *
     * @param inviteToken invitation token
     * @param nodeId      node id
     * @return InvitationEntity
     */
    InvitationEntity selectByInviteTokenAndNodeId(@Param("inviteToken") String inviteToken,
                                                  @Param("nodeId") String nodeId);
}
