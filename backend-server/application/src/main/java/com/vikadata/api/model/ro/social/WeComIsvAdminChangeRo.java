package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * 租户空间更换主管理员
 * </p>
 */
@ApiModel("租户空间更换主管理员")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvAdminChangeRo {

    @ApiModelProperty(value = "应用套件 ID", required = true)
    @NotNull
    private String suiteId;

    @ApiModelProperty(value = "授权的企业 ID", required = true)
    @NotNull
    private String authCorpId;

    @ApiModelProperty(value = "空间站 ID", required = true)
    @NotBlank
    private String spaceId;

    @ApiModelProperty(value = "新主管理员的成员 ID", required = true)
    @NotNull
    private Long memberId;

}
