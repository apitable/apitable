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
 * 玉符 IDaaS 绑定租户下的应用
 * </p>
 * @author 刘斌华
 * @date 2022-05-23 16:45:33
 */
@ApiModel("玉符 IDaaS 绑定租户下的应用")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasAppBindVo {

    @ApiModelProperty("单点登录 URL")
    private String initiateLoginUri;

    @ApiModelProperty("登录回调 URL")
    private String redirectUri;

    @Tolerate
    public IdaasAppBindVo() {
        // default constructor
    }

}
