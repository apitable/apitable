package com.vikadata.api.modular.idaas.model;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * 玉符 IDaaS 创建租户
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 18:36:28
 */
@ApiModel("玉符 IDaaS 创建租户")
@Setter
@Getter
@ToString
@EqualsAndHashCode
@Validated
public class IdaasTenantCreateRo {

    @ApiModelProperty(value = "租户名。只能是小写字母和数字，且不能以数字开头", required = true)
    @NotBlank
    private String tenantName;

    @ApiModelProperty(value = "企业名称。中文全称", required = true)
    @NotBlank
    private String corpName;

    @ApiModelProperty(value = "默认管理员账号", required = true)
    @NotBlank
    private String adminUsername;

    @ApiModelProperty(value = "默认管理员密码", required = true)
    @NotBlank
    private String adminPassword;

    @ApiModelProperty(value = "系统级 ServiceAccount", required = true)
    @NotNull
    @Valid
    private ServiceAccount serviceAccount;

    @Setter
    @Getter
    @ToString
    @EqualsAndHashCode
    public static class ServiceAccount {

        @ApiModelProperty(value = "Client ID", required = true)
        @NotBlank
        private String clientId;

        @ApiModelProperty(value = "Private Key", required = true)
        @NotNull
        @Valid
        private PrivateKey privateKey;

        @Setter
        @Getter
        @ToString
        @EqualsAndHashCode
        public static class PrivateKey {

            @NotBlank
            private String p;

            @NotBlank
            private String kty;

            @NotBlank
            private String q;

            @NotBlank
            private String d;

            @NotBlank
            private String e;

            @NotBlank
            private String use;

            @NotBlank
            private String kid;

            @NotBlank
            private String qi;

            @NotBlank
            private String dp;

            @NotBlank
            private String dq;

            @NotBlank
            private String n;

        }

    }

}
