package com.vikadata.api.model.vo.space;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Administrator View
 * </p>
 */
@Data
@ApiModel("Administrator View")
public class SpaceRoleVo {

    @ApiModelProperty(value = "Role ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Head portrait address", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 3)
    private String avatar;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 4)
    private String memberName;

    @ApiModelProperty(value = "DEPARTMENT", example = "Technology Department/R&D Department", position = 5)
    private String team;

    @ApiModelProperty(value = "Phone number", example = "13610102020", position = 6)
    private String mobile;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 7)
    private Boolean isActive;

    @JsonIgnore
    private String tempResourceGroupCodes;

    @ApiModelProperty(value = "Resource group code list", example = "[\"MANAGE_SECURITY\",\"MANAGE_TEAM\"]", position = 8)
    private List<String> resourceGroupCodes;

    @Deprecated
    @ApiModelProperty(value = "Permission range (old)", position = 9)
    private List<RoleResourceVo> resourceScope;

    @ApiModelProperty(value = "Creation time", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "Creation time", example = "2020-03-18T15:29:59.000", position = 11)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 12)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 13)
    private Boolean isMemberNameModified;

}
