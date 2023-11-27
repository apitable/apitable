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

package com.apitable.space.service;

import com.apitable.space.dto.InvitationUserDTO;
import com.apitable.space.entity.InvitationEntity;
import com.apitable.space.vo.SpaceLinkInfoVo;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * invitation service.
 */
public interface IInvitationService extends IService<InvitationEntity> {

    /**
     * get space invitation base info.
     *
     * @param spaceId space id
     * @param creator member ID to create the link
     * @return SpaceLinkInfoVo
     */
    SpaceLinkInfoVo getInvitationInfo(String spaceId, Long creator);

    /**
     * follow-up actions after successful invitation.
     *
     * @param dto invitation user info
     */
    void asyncActionsForSuccessJoinSpace(InvitationUserDTO dto);

    /**
     * update member invitation status by space id.
     *
     * @param spaceId space id
     */
    void closeMemberInvitationBySpaceId(String spaceId);

    /**
     * get by member id and space id and node id.
     *
     * @param memberId member id
     * @param spaceId  space id
     * @param nodeId   node id
     * @return InvitationEntity
     */
    InvitationEntity getByMemberIdAndSpaceIdAndNodeId(Long memberId, String spaceId, String nodeId);

    /**
     * get member invitation token by node id.
     *
     * @param spaceId  space id
     * @param memberId operator member id
     * @param nodeId   link node id
     * @return link token
     */
    String getMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId);

    /**
     * create member invitation token by node id.
     *
     * @param spaceId  space id
     * @param memberId operator member id
     * @param nodeId   link node id
     * @return InvitationEntity
     */
    String createMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId);

    /**
     * user invites to join space station and assigns updater privileges.
     *
     * @param token  invitation token
     * @param userId userID that should be added to the space station
     * @return InvitationUserDTO
     */
    InvitationUserDTO invitedUserJoinSpaceByToken(Long userId, String token);

    /**
     * check if the invitation token is valid.
     *
     * @param token  invitation token
     * @param nodeId requested nodeId
     * @return InvitationEntity
     */
    InvitationEntity validInvitationToken(String token, String nodeId);

}
