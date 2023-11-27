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

package com.apitable.workspace.vo;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * Recycle Bin Node Information View.
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Recycle Bin Node Information View")
public class RubbishNodeVo extends BaseNodeInfo {

    /**
     * Space ID.
     */
    @Schema(description = "Space ID", example = "spc09")
    private String spaceId;

    /**
     * Icon.
     */
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Node icon", example = ":smile")
    private String icon;

    /**
     * uuid.
     */
    @Schema(description = "User uuid of the deleted user",
        type = "java.lang.String", example = "1")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    /**
     * Member Name.
     */
    @Schema(description = "Deleted by Member Name",
        type = "java.lang.String", example = "Li Si")
    private String memberName;

    /**
     * User Avatar.
     */
    @Schema(description = "Remover's avatar",
        example = "public/2020/token")
    @JsonSerialize(nullsUsing = NullStringSerializer.class,
        using = ImageSerializer.class)
    private String avatar;

    /**
     * Is Nick Name Modified.
     */
    @Schema(description = "Whether the user has modified the nickname")
    private Boolean isNickNameModified;

    /**
     * Is Member Name Modified.
     */
    @Schema(description = "Whether the member has modified the nickname")
    private Boolean isMemberNameModified;

    /**
     * Delete Time.
     */
    @Schema(description = "Delete time(millisecond)",
        example = "1573561644000")
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime deletedAt;

    /**
     * Delete Path.
     */
    @Schema(description = "Delete Path",
        type = "java.lang.String", example = "A/B")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String delPath;

    /**
     * Remain Day.
     */
    @Schema(description = "Days Remain", example = "1")
    private Long remainDay;

    /**
     * Avatar Color.
     */
    @Schema(description = "default avatar color number", example = "1")
    private Integer avatarColor;

    /**
     * Nick Name.
     */
    @Schema(description = "Nick Name", example = "Zhang San")
    private String nickName;

}
