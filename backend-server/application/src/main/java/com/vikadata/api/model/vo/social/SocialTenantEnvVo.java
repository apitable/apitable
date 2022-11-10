package com.vikadata.api.model.vo.social;

import java.util.Map;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Third party integrated tenant environment configuration view
 * </p>
 */
@Data
@ApiModel("Third party integrated tenant environment configuration view")
public class SocialTenantEnvVo {

    @ApiModelProperty(value = "Domain name", position = 1)
    private String domainName;

    @ApiModelProperty(value = "Tenant Integration Environment Collection", position = 2)
    private Map<String, Object> envs;

    @Data
    @Builder(toBuilder = true)
    @NoArgsConstructor
    @AllArgsConstructor
    @ApiModel("Integrated WeCom environment view")
    public static class WeComEnv {

        @ApiModelProperty(value = "WeCom-Enterprise Id", position = 1)
        private String corpId;

        @ApiModelProperty(value = "WeCom-Self built application ID", position = 2)
        private String agentId;

        @ApiModelProperty(value = "WeCom-Enable", position = 3)
        private Boolean enabled;

    }

}
