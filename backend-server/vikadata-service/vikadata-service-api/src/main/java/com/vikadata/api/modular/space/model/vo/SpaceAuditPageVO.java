package com.vikadata.api.modular.space.model.vo;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.LocalDateTimeToMilliSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 空间审计信息VO
 * </p>
 *
 * @author Chambers
 * @date 2022/5/20
 */
@Data
@ApiModel("空间审计信息")
public class SpaceAuditPageVO {

    @ApiModelProperty(value = "创建时间时间戳(毫秒)", dataType = "java.lang.Long", example = "1573561644000", position = 1)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "操作动作", dataType = "java.lang.String", example = "create_space", position = 2)
    private String action;

    @ApiModelProperty(value = "操作人信息", position = 3)
    private Operator operator;

    @ApiModelProperty(value = "审计内容变量", position = 4)
    private AuditContent body;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("操作人信息")
    public static class Operator {

        @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 1)
        @JsonSerialize(using = ToStringSerializer.class)
        private Long memberId;

        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        @ApiModelProperty(value = "头像地址", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
        private String avatar;

        @ApiModelProperty(value = "成员姓名", example = "张三", position = 3)
        private String memberName;

        @ApiModelProperty(value = "是否已激活", example = "true", position = 4)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isActive;

        @ApiModelProperty(value = "是否被删除", example = "true", position = 5)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isDeleted;

        @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 6)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isNickNameModified;

        @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 7)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isMemberNameModified;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("审计内容")
    public static class AuditContent {

        @ApiModelProperty(value = "空间信息")
        private Space space;

        @ApiModelProperty(value = "组织单元信息列表")
        private List<Unit> units;

        @ApiModelProperty(value = "权限信息")
        private Control control;

        @ApiModelProperty(value = "节点信息")
        private Node node;

        @ApiModelProperty(value = "组织单元信息列表")
        private Template template;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("空间信息")
    public static class Space {
        @ApiModelProperty(value = "空间ID", position = 1)
        private String spaceId;

        @ApiModelProperty(value = "旧空间名称（操作之前，固定）", position = 2)
        private String oldSpaceName;

        @ApiModelProperty(value = "空间名称（操作当时，固定）", position = 2)
        private String spaceName;

        @ApiModelProperty(value = "旧空间Logo（操作之前，固定）", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String oldSpaceLogo;

        @ApiModelProperty(value = "空间Logo（操作当时，固定）", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String spaceLogo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("组织单元信息")
    public static class Unit {

        @ApiModelProperty(value = "组织单元ID", position = 1)
        @JsonSerialize(using = ToStringSerializer.class)
        private Long unitId;

        @ApiModelProperty(value = "分类：1-部门，3-成员", position = 2)
        private Integer type;

        @ApiModelProperty(value = "部门/成员名称", position = 3)
        private String name;

        @ApiModelProperty(value = "成员头像，分类为成员时会返回", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String avatar;

        @ApiModelProperty(value = "是否已激活", example = "true", position = 4)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isActive;

        @ApiModelProperty(value = "是否被删除", example = "true", position = 5)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isDeleted;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("权限信息")
    public static class Control {

        @ApiModelProperty(value = "旧权限角色", position = 1)
        private String oldRole;

        @ApiModelProperty(value = "权限角色", position = 2)
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("节点信息")
    public static class Node {

        @ApiModelProperty(value = "节点ID", position = 1)
        private String nodeId;

        @ApiModelProperty(value = "节点类型", position = 2)
        private Integer nodeType;

        @ApiModelProperty(value = "旧父节点名称（操作之前，固定）", position = 3)
        private String oldParentName;

        @ApiModelProperty(value = "父节点名称（操作当时，固定）", position = 3)
        private String parentName;

        @ApiModelProperty(value = "旧节点名称（操作之前，固定）", position = 4)
        private String oldNodeName;

        @ApiModelProperty(value = "节点名称（操作当时，固定）", position = 4)
        private String nodeName;

        @ApiModelProperty(value = "当前节点名称（当前最新，动态）", position = 4)
        private String currentNodeName;

        @ApiModelProperty(value = "旧节点icon（操作之前，固定）", position = 5)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String oldNodeIcon;

        @ApiModelProperty(value = "节点icon（操作当时，固定）", position = 5)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String nodeIcon;

        @ApiModelProperty(value = "当前节点icon（当前最新，动态）", position = 5)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String currentNodeIcon;

        @ApiModelProperty(value = "被复制的节点ID", position = 6)
        private String sourceNodeId;

        @ApiModelProperty(value = "被复制的节点名称（操作当时，固定）", position = 6)
        private String sourceNodeName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("模板信息")
    public static class Template {

        @ApiModelProperty(value = "模板ID", position = 1)
        private String templateId;

        @ApiModelProperty(value = "模板名称", position = 2)
        private String templateName;
    }
}
