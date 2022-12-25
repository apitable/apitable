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

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.organization.vo.CreatedMemberInfoVo;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullObjectSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

import static com.apitable.shared.constants.DateFormatConstants.TIME_NORM_PATTERN;

/**
 * <p>
 * Folder preview vo
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Folder preview vo")
public class ShowcaseVo {

    @ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "Node Name", example = "This is a node", position = 2)
    protected String nodeName;

    @ApiModelProperty(value = "Node Type 0-ROOT（Root node） 1-folder（Folder） 2-file（Numerical table）", example = "1", position = 3)
    private Integer type;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Node icon", example = "smile", position = 3)
    private String icon;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Cover", example = "http://...", position = 4)
    private String cover;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Describe", example = "This is a showcase", position = 5)
    private String description;

    @ApiModelProperty(value = "Role", example = "editor", position = 6)
    private String role;

    @ApiModelProperty(value = "Node Permissions", position = 6)
    private NodePermissionView permissions;

    @ApiModelProperty(value = "Whether the node is a star", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeFavorite;

    @ApiModelProperty(value = "Node Creator Information", position = 8)
    private CreatedMemberInfoVo createdMemberInfo;

    @ApiModelProperty(value = "Node update time", example = "2021-05-04", position = 9)
    @JsonFormat(pattern = TIME_NORM_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "Third party information", position = 10)
    private Social socialInfo;

    @ApiModelProperty(value = "Other information", position = 11)
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private NodeExtra extra;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Deprecated
    public static class Social {
        @ApiModelProperty(value = "DingTalk application status 0 means deactivated, 1 means enabled, 2 means deleted, and 3 means unpublished", position = 1)
        @JsonSerialize(nullsUsing = NullNumberSerializer.class)
        private Integer dingTalkDaStatus;

        @ApiModelProperty(value = "DingTalk isv suiteKey", position = 2)
        private String dingTalkSuiteKey;

        @ApiModelProperty(value = "DingTalk isv authorized Enterprise Id", position = 3)
        private String dingTalkCorpId;

        @ApiModelProperty(value = "Source template Id", position = 4)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String sourceTemplateId;

        @ApiModelProperty(value = "Whether to display the prompt of successful creation", position = 5)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean showTips;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeExtra {
        @ApiModelProperty(value = "DingTalk application status 0 means deactivated, 1 means enabled, 2 means deleted, and 3 means unpublished", position = 1)
        @JsonSerialize(nullsUsing = NullNumberSerializer.class)
        private Integer dingTalkDaStatus;

        @ApiModelProperty(value = "DingTalk isv suiteKey", position = 2)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String dingTalkSuiteKey;

        @ApiModelProperty(value = "DingTalk isv authorized Enterprise Id", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String dingTalkCorpId;

        @ApiModelProperty(value = "Source template Id", position = 4)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String sourceTemplateId;

        @ApiModelProperty(value = "Whether to display the prompt of successful creation", position = 5)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean showTips;
    }
}
