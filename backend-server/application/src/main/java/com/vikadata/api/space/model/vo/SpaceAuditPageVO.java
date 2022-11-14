package com.vikadata.api.space.model.vo;

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

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

@Data
@ApiModel("Space Audit Info Page")
public class SpaceAuditPageVO {

    @ApiModelProperty(value = "created time(millisecond)", dataType = "java.lang.Long", example = "1573561644000", position = 1)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "action", dataType = "java.lang.String", example = "create_space", position = 2)
    private String action;

    @ApiModelProperty(value = "operator", position = 3)
    private Operator operator;

    @ApiModelProperty(value = "audit content", position = 4)
    private AuditContent body;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("Operator Info")
    public static class Operator {

        @ApiModelProperty(value = "member id", dataType = "java.lang.String", example = "1", position = 1)
        @JsonSerialize(using = ToStringSerializer.class)
        private Long memberId;

        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        @ApiModelProperty(value = "avatar url", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
        private String avatar;

        @ApiModelProperty(value = "member name", example = "张三", position = 3)
        private String memberName;

        @ApiModelProperty(value = "is active", example = "true", position = 4)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isActive;

        @ApiModelProperty(value = "is deleted", example = "true", position = 5)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isDeleted;

        @ApiModelProperty(value = "whether the nickname has been modified", position = 6)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isNickNameModified;

        @ApiModelProperty(value = "whether the member name has been modified", position = 7)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isMemberNameModified;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("Audit Content")
    public static class AuditContent {

        @ApiModelProperty(value = "space info")
        private Space space;

        @ApiModelProperty(value = "unit infos")
        private List<Unit> units;

        @ApiModelProperty(value = "control")
        private Control control;

        @ApiModelProperty(value = "node info")
        private Node node;

        @ApiModelProperty(value = "temlate info")
        private Template template;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("Space Info")
    public static class Space {
        @ApiModelProperty(value = "spaceId", position = 1)
        private String spaceId;

        @ApiModelProperty(value = "old space name（before operation, fixed）", position = 2)
        private String oldSpaceName;

        @ApiModelProperty(value = "space name（operating at the time，fixed）", position = 2)
        private String spaceName;

        @ApiModelProperty(value = "old space logo（before operation, fixed）", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String oldSpaceLogo;

        @ApiModelProperty(value = "space log（operating at the time，fixed）", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String spaceLogo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("Unit Info")
    public static class Unit {

        @ApiModelProperty(value = "unitId", position = 1)
        @JsonSerialize(using = ToStringSerializer.class)
        private Long unitId;

        @ApiModelProperty(value = "unit type", position = 2)
        private Integer type;

        @ApiModelProperty(value = "unit name", position = 3)
        private String name;

        @ApiModelProperty(value = "member avatar (optional)", position = 3)
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String avatar;

        @ApiModelProperty(value = "is dctive", example = "true", position = 4)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isActive;

        @ApiModelProperty(value = "is deleted", example = "true", position = 5)
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isDeleted;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("Control Info")
    public static class Control {

        @ApiModelProperty(value = "old role", position = 1)
        private String oldRole;

        @ApiModelProperty(value = "role", position = 2)
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("Node Info")
    public static class Node {

        @ApiModelProperty(value = "node id", position = 1)
        private String nodeId;

        @ApiModelProperty(value = "node type", position = 2)
        private Integer nodeType;

        @ApiModelProperty(value = "old parent node name（before operation, fixed）", position = 3)
        private String oldParentName;

        @ApiModelProperty(value = "parent node name（operating at the time，fixed）", position = 3)
        private String parentName;

        @ApiModelProperty(value = "old node name（before operation, fixed）", position = 4)
        private String oldNodeName;

        @ApiModelProperty(value = "node name（operating at the time，fixed)", position = 4)
        private String nodeName;

        @ApiModelProperty(value = "current node name（the latest，dynamic）", position = 4)
        private String currentNodeName;

        @ApiModelProperty(value = "old node icon（before operation, fixed）", position = 5)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String oldNodeIcon;

        @ApiModelProperty(value = "node icon（operating at the time，fixed）", position = 5)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String nodeIcon;

        @ApiModelProperty(value = "current node icon（the latest，dynamic）", position = 5)
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        private String currentNodeIcon;

        @ApiModelProperty(value = "the replicated node id", position = 6)
        private String sourceNodeId;

        @ApiModelProperty(value = "the replicated node name（operating at the time，fixed）", position = 6)
        private String sourceNodeName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @ApiModel("Template Info")
    public static class Template {

        @ApiModelProperty(value = "template id", position = 1)
        private String templateId;

        @ApiModelProperty(value = "template name", position = 2)
        private String templateName;
    }
}
