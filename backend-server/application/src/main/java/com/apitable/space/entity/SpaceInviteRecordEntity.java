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

package com.apitable.space.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * Workbench - Invitation Record Table.
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName(keepGlobalPrefix = true, value = "space_invite_record")
public class SpaceInviteRecordEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary key.
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * Inviter Member ID.
     */
    private Long inviteMemberId;

    /**
     * Invitation Space ID.
     */
    private String inviteSpaceId;

    /**
     * Invite Space Name.
     */
    private String inviteSpaceName;

    /**
     * Invite Email.
     */
    private String inviteEmail;

    /**
     * Unique token ID of invitation link.
     */
    private String inviteToken;

    /**
     * Invite Link.
     */
    private String inviteUrl;

    /**
     * Mail send status(0:Fail,1:Success).
     */
    private Boolean sendStatus;

    /**
     * Status Description.
     */
    private String statusDesc;

    /**
     * Is it invalid(0:No,1:Yes).
     */
    private Boolean isExpired;

    /**
     * Create Time.
     */
    private LocalDateTime createdAt;

}
