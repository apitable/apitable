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

import com.apitable.organization.vo.CreatedMemberInfoVo;
import com.apitable.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullObjectSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Folder preview vo.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Folder preview vo")
public class ShowcaseVo {

    @Schema(description = "Node ID", example = "nod10")
    private String nodeId;

    @Schema(description = "Node Name", example = "This is a node")
    protected String nodeName;

    @Schema(description = "Node Type 0-ROOT（Root node） 1-folder（Folder） 2-file（Numerical table）",
        example = "1")
    private Integer type;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Node icon", example = "smile")
    private String icon;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Cover", example = "http://...")
    private String cover;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Describe", example = "This is a showcase")
    private String description;

    @Schema(description = "Role", example = "editor")
    private String role;

    @Schema(description = "Node Permissions")
    private NodePermissionView permissions;

    @Schema(description = "Whether the node is a star")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeFavorite;

    @Schema(description = "Node Creator Information")
    private CreatedMemberInfoVo createdMemberInfo;

    @Schema(description = "Node update time", example = "1677257886000")
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime updatedAt;

    @Schema(description = "Third party information")
    private Social socialInfo;

    @Schema(description = "Other information")
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private NodeExtra extra;

    /**
     * Social.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Deprecated
    public static class Social {

        @Schema(description = "DingTalk application status 0 means deactivated, 1 means enabled, "
            + "2 means deleted, and 3 means unpublished")
        @JsonSerialize(nullsUsing = NullNumberSerializer.class)
        private Integer dingTalkDaStatus;

        @Schema(description = "DingTalk isv suiteKey")
        private String dingTalkSuiteKey;

        @Schema(description = "DingTalk isv authorized Enterprise Id")
        private String dingTalkCorpId;

        @Schema(description = "Source template Id")
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String sourceTemplateId;

        @Schema(description = "Whether to display the prompt of successful creation")
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean showTips;
    }

    /**
     * NodeExtra.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeExtra {

        @Schema(description = "DingTalk application status 0 means deactivated, 1 means enabled, "
            + "2 means deleted, and 3 means unpublished")
        @JsonSerialize(nullsUsing = NullNumberSerializer.class)
        private Integer dingTalkDaStatus;

        @Schema(description = "DingTalk isv suiteKey")
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String dingTalkSuiteKey;

        @Schema(description = "DingTalk isv authorized Enterprise Id")
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String dingTalkCorpId;

        @Schema(description = "Source template Id")
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String sourceTemplateId;

        @Schema(description = "Whether to display the prompt of successful creation")
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean showTips;
    }
}
