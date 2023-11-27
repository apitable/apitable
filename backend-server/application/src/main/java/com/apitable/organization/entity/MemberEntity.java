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

package com.apitable.organization.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
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
 * Organizational Structure - Member Table.
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
@TableName(keepGlobalPrefix = true, value = "unit_member")
public class MemberEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key.
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * User ID(link#xxxx_user#id).
     */
    private Long userId;

    /**
     * Space ID(link#xxxx_space#space_id).
     */
    private String spaceId;

    /**
     * Member Name.
     */
    private String memberName;

    /**
     * Job Number.
     */
    private String jobNumber;

    /**
     * Position.
     */
    private String position;

    /**
     * Phone Number.
     */
    private String mobile;

    /**
     * Email.
     */
    private String email;

    /**
     * Third party platform user ID.
     */
    private String openId;

    /**
     * The user space status (0: inactive; 1: active; 2: pre delete; 3: logout cool down period pre delete).
     */
    private Integer status;

    /**
     * Tag indicate whether the member name has been modified (0: No, 1: Yes).
     */
    private Boolean nameModified;

    /**
     * Whether the nickname has been modified as a third-party IM user. 0: No; 1: Yes; 2: Not an IM third-party user.
     */
    private Integer isSocialNameModified;

    /**
     * Whether there are small red dots (0: No, 1: Yes).
     */
    private Boolean isPoint;

    /**
     * Activate or not (0: No, 1: Yes).
     */
    private Boolean isActive;

    /**
     * Administrator or not (0: No, 1: Yes).
     */
    private Boolean isAdmin;

    /**
     * Delete Tag (0: No, 1: Yes).
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * Create Time.
     */
    private LocalDateTime createdAt;

    /**
     * Update Time.
     */
    private LocalDateTime updatedAt;

}
