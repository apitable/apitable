package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Organization Unit View
 * </p>
 */
@Data
@ApiModel("Organization Unit View")
public class OrganizationUnitVo {

    @ApiModelProperty(value = "ID ID, classified by type, type=1, department ID, type=2, member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @ApiModelProperty(value = "Name", example = "R&D Department | Zhang San", position = 2)
    private String name;

    @ApiModelProperty(value = "Department name (not highlighted)", example = "Technical team", position = 2)
    private String originName;

    @ApiModelProperty(value = "Classification: 1-department, 2-member", example = "1", position = 3)
    private Integer type;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Member avatar, which will be returned when classified as a member", example = "http://www.vikadata.com/image.png", position = 4)
    private String avatar;

    @ApiModelProperty(value = "The department to which the member belongs will be returned when classified as a member", example = "Operation Assistant", position = 5)
    private String teams;

    @ApiModelProperty(value = "Whether the member has been activated. When classified as a member, it will return", example = "true", position = 5)
    private Boolean isActive;

    @ApiModelProperty(value = "Short name of the department. It will be returned when it is classified as a department", example = "Research and development", position = 6)
    private String shortName;

    @ApiModelProperty(value = "Number of department members, which will be returned when classified as a department", example = "3", position = 7)
    private Integer memberCount;

    @ApiModelProperty(value = "If there is a sub department, it will be returned when it is classified as a department", example = "true", position = 8)
    private Boolean hasChildren;
}
