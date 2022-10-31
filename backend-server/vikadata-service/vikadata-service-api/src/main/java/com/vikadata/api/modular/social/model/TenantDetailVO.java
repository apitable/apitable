package com.vikadata.api.modular.social.model;

import java.time.LocalDate;
import java.util.List;

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import com.vikadata.api.support.serializer.ImageSerializer;

/**
 * Tenant information
 */
@Data
@ApiModel("Tenant information")
public class TenantDetailVO {

    @ApiModelProperty(value = "List of bound spaces", position = 1)
    private List<Space> spaces;

    @ApiModelProperty(value = "Enterprise ID", example = "17236123", position = 2)
    private String tenantKey;

    @ApiModelProperty(value = "Enterprise name", example = "Enterprise name", position = 3)
    private String tenantName;

    @ApiModelProperty(value = "Corporate avatar", example = "https://....", position = 3)
    private String avatar;

    @Setter
    @Getter
    public static class Space {

        @ApiModelProperty(value = "Space identification", example = "spc21182sjahsd", position = 1)
        private String spaceId;

        @ApiModelProperty(value = "Space name", example = "vika", position = 2)
        private String spaceName;

        @ApiModelProperty(value = "Space logo", example = "logo", position = 2)
        @JsonSerialize(using = ImageSerializer.class)
        private String spaceLogo;

        @ApiModelProperty(value = "Primary administrator ID", example = "123", position = 2)
        @JsonSerialize(using = ToStringSerializer.class)
        private Long mainAdminUserId;

        @ApiModelProperty(value = "Primary administrator name", example = "LiSi", position = 2)
        private String mainAdminUserName;

        @ApiModelProperty(value = "Head portrait of the main administrator", example = "logo", position = 2)
        @JsonSerialize(using = ImageSerializer.class)
        private String mainAdminUserAvatar;

        @ApiModelProperty(value = "Subscription product name", example = "Bronze", position = 3)
        private String product;

        @ApiModelProperty(value = "Subscription expiration time, blank if free", example = "2019-01-01", position = 4)
        @JsonFormat(pattern = DatePattern.NORM_DATE_PATTERN)
        @JsonSerialize(using = LocalDateSerializer.class)
        private LocalDate deadline;
    }
}
