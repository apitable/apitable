package com.vikadata.api.modular.idaas.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Tolerate;

/**
 * <p>
 * 玉符 IDaaS 创建租户
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 18:37:08
 */
@ApiModel("玉符 IDaaS 创建租户")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasTenantCreateVo {

    /**
     * 主键 ID
     */
    @ApiModelProperty("主键 ID")
    private Long id;

    /**
     * 租户 ID
     */
    @ApiModelProperty("租户 ID")
    private String tenantId;

    /**
     * 租户名
     */
    @ApiModelProperty("租户名")
    private String tenantName;

    @Tolerate
    public IdaasTenantCreateVo() {
        // default constructor
    }

}
