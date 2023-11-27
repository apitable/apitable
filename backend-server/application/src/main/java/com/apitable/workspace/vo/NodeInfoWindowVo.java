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
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * Node information window vo.
 * </p>
 */
@Data
@Builder(toBuilder = true)
public class NodeInfoWindowVo {

    /**
     * Node ID.
     */
    private String nodeId;

    /**
     * Node Name.
     */
    private String nodeName;

    /**
     * Node Type.
     */
    private Integer nodeType;

    /**
     * Node icon.
     */
    private String icon;

    /**
     * Created by.
     */
    private MemberInfo creator;

    /**
     * Recently modified by.
     */
    private MemberInfo lastModifier;

    /**
     * member info.
     */
    @Data
    @Builder(toBuilder = true)
    public static class MemberInfo {

        /**
         * Member Name.
         */
        private String memberName;

        /**
         * Member avatar.
         */
        @JsonSerialize(nullsUsing = NullStringSerializer.class,
            using = ImageSerializer.class)
        private String avatar;

        /**
         * default avatar number.
         */
        private Integer avatarColor;

        /**
         * user nick name.
         */
        private String nickName;

        /**
         * Time stamp.
         */
        @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
        private LocalDateTime time;

        /**
         * Whether the member is activated.
         */
        private Boolean isActive;

        /**
         * Delete member.
         */
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isDeleted;
    }
}
