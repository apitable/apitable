package com.vikadata.api.enterprise.idaas.model;

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
 * IDaaS Create tenant
 * </p>
 */
@ApiModel("IDaaS Create tenant")
@Setter
@Getter
@ToString
@EqualsAndHashCode
@Validated
public class IdaasTenantCreateRo {

    @ApiModelProperty(value = "Tenant name. Can only be lowercase letters and numbers, and cannot start with a number", required = true)
    @NotBlank
    private String tenantName;

    @ApiModelProperty(value = "Enterprise name. Full Chinese name", required = true)
    @NotBlank
    private String corpName;

    @ApiModelProperty(value = "Default administrator account", required = true)
    @NotBlank
    private String adminUsername;

    @ApiModelProperty(value = "Default Administrator Password", required = true)
    @NotBlank
    private String adminPassword;

    @ApiModelProperty(value = "System level ServiceAccount", required = true)
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
