package com.vikadata.api.model.vo.node;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.model.vo.organization.CreatedMemberInfoVo;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullObjectSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

import static com.vikadata.api.constants.DateFormatConstants.TIME_NORM_PATTERN;

/**
 * <p>
 * 文件夹预览vo
 * </p>
 *
 * @author Chambers
 * @date 2020/5/19
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("文件夹预览vo")
public class ShowcaseVo {

    @ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "节点名称", example = "这是一个节点", position = 2)
    protected String nodeName;

    @ApiModelProperty(value = "节点类型 0-ROOT（根节点） 1-folder（文件夹） 2-file（数表）", example = "1", position = 3)
    private Integer type;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "节点图标", example = "smile", position = 3)
    private String icon;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "封面图", example = "http://...", position = 4)
    private String cover;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "描述", example = "这是一个showcase", position = 5)
    private String description;

    @ApiModelProperty(value = "角色", example = "editor", position = 6)
    private String role;

    @ApiModelProperty(value = "节点权限", position = 6)
    private NodePermissionView permissions;

    @ApiModelProperty(value = "节点是否是星标", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeFavorite;

    @ApiModelProperty(value = "节点创建人信息", position = 8)
    private CreatedMemberInfoVo createdMemberInfo;

    @ApiModelProperty(value = "节点更新时间", example = "2021-05-04", position = 9)
    @JsonFormat(pattern = TIME_NORM_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "第三方信息", position = 10)
    private Social socialInfo;

    @ApiModelProperty(value = "其他信息", position = 11)
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private NodeExtra extra;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Deprecated
    public static class Social {
        @ApiModelProperty(value = "钉钉搭应用状态0表示停用，1表示启用, 2表示删除, 3表示未发布", position = 1)
        @JsonSerialize(nullsUsing = NullNumberSerializer.class)
        private Integer dingTalkDaStatus;

        @ApiModelProperty(value = "钉钉isv的suiteKey", position = 2)
        private String dingTalkSuiteKey;

        @ApiModelProperty(value = "钉钉isv的授权企业Id", position = 3)
        private String dingTalkCorpId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeExtra {
        @ApiModelProperty(value = "钉钉搭应用状态0表示停用，1表示启用, 2表示删除, 3表示未发布", position = 1)
        @JsonSerialize(nullsUsing = NullNumberSerializer.class)
        private Integer dingTalkDaStatus;

        @ApiModelProperty(value = "钉钉isv的suiteKey", position = 2)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String dingTalkSuiteKey;

        @ApiModelProperty(value = "钉钉isv的授权企业Id", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String dingTalkCorpId;

        @ApiModelProperty(value = "来源templateId", position = 4)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String sourceTemplateId;

        @ApiModelProperty(value = "是否展示创建成功的提示", position = 5)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean showTips;
    }
}
