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
 * 获取空间站绑定的玉符信息
 * </p>
 * @author 刘斌华
 * @date 2022-06-08 11:29:00
 */
@ApiModel("获取空间站绑定的玉符信息")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasBindInfoVo {

    @ApiModelProperty("是否绑定了玉符 IDaaS 应用")
    private Boolean enabled;

    @ApiModelProperty("绑定的玉符 IDaaS 应用的 Client ID")
    private String clientId;

    @Tolerate
    public IdaasBindInfoVo() {
        // default constructor
    }

}
