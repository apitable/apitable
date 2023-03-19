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

package com.apitable.user.entity;

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
 * User Table.
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
@TableName(keepGlobalPrefix = true, value = "user")
public class UserEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key.
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * User ID.
     */
    private String uuid;

    /**
     * Nick Name.
     */
    private String nickName;

    /**
     * code.
     */
    private String code;

    /**
     * Phone Number.
     */
    private String mobilePhone;

    /**
     * Email.
     */
    private String email;

    /**
     * Password.
     */
    private String password;

    /**
     * Avatar.
     */
    private String avatar;

    /**
     * default avatar color number.
     */
    private Integer color;

    /**
     * Time Zone.
     */
    private String timeZone;

    /**
     * Gender.
     */
    private String gender;

    /**
     * Remark.
     */
    private String remark;

    /**
     * Language.
     */
    private String locale;

    /**
     * Unique identification in open application of DingTalk.
     */
    private String dingOpenId;

    /**
     * Unique identifier in the DingTalk developer enterprise.
     */
    private String dingUnionId;

    /**
     * Last Login Time.
     */
    private LocalDateTime lastLoginTime;

    /**
     * Whether the nickname has been modified as a third-party IM user. 0: No;
     * 1: Yes; 2: Not an IM third-party user.
     */
    private Integer isSocialNameModified;

    /**
     * Whether to cancel the cool off period (1: Yes, 0: No).
     */
    private Boolean isPaused;

    /**
     * Delete Tag (1: Yes, 0: No).
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
