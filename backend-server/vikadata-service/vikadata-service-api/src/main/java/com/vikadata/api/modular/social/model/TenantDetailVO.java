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
 * 租户信息
 *
 * @author Shawn Deng
 * @date 2020-12-09 10:49:13
 */
@Data
@ApiModel("租户信息")
public class TenantDetailVO {

    @ApiModelProperty(value = "绑定的空间列表", position = 1)
    private List<Space> spaces;

    @ApiModelProperty(value = "企业标识", example = "17236123", position = 2)
    private String tenantKey;

    @ApiModelProperty(value = "企业名称", example = "企业名称", position = 3)
    private String tenantName;

    @ApiModelProperty(value = "企业头像", example = "https://....", position = 3)
    private String avatar;

    @Setter
    @Getter
    public static class Space {

        @ApiModelProperty(value = "空间站标识", example = "spc21182sjahsd", position = 1)
        private String spaceId;

        @ApiModelProperty(value = "空间站名称", example = "维格智数", position = 2)
        private String spaceName;

        @ApiModelProperty(value = "空间站logo", example = "logo", position = 2)
        @JsonSerialize(using = ImageSerializer.class)
        private String spaceLogo;

        @ApiModelProperty(value = "主管理员ID", example = "123", position = 2)
        @JsonSerialize(using = ToStringSerializer.class)
        private Long mainAdminUserId;

        @ApiModelProperty(value = "主管理员名称", example = "李四", position = 2)
        private String mainAdminUserName;

        @ApiModelProperty(value = "主管理员头像", example = "logo", position = 2)
        @JsonSerialize(using = ImageSerializer.class)
        private String mainAdminUserAvatar;

        @ApiModelProperty(value = "订阅产品名称", example = "Bronze", position = 3)
        private String product;

        @ApiModelProperty(value = "订阅到期时间, 免费则为空", example = "2019-01-01", position = 4)
        @JsonFormat(pattern = DatePattern.NORM_DATE_PATTERN)
        @JsonSerialize(using = LocalDateSerializer.class)
        private LocalDate deadline;
    }
}
