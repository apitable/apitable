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
 * 跳转前往玉符 IDaaS 系统进行登录
 * </p>
 * @author 刘斌华
 * @date 2022-05-25 10:33:16
 */
@ApiModel("玉符 IDaaS 绑定租户下的应用")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasAuthLoginVo {

    @ApiModelProperty("登录的地址")
    private String loginUrl;

    @Tolerate
    public IdaasAuthLoginVo() {
        // default constructor
    }

}
