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
 * 第三方集成租户环境配置视图
 * </p>
 *
 * @author Pengap
 * @date 2021/8/24 16:51:58
 */
@Data
@ApiModel("第三方集成租户环境配置视图")
public class SocialTenantEnvVo {

    @ApiModelProperty(value = "域名", position = 1)
    private String domainName;

    @ApiModelProperty(value = "租户集成环境集合", position = 2)
    private Map<String, Object> envs;

    @Data
    @Builder(toBuilder = true)
    @NoArgsConstructor
    @AllArgsConstructor
    @ApiModel("集成企业微信环境视图")
    public static class WeComEnv {

        @ApiModelProperty(value = "企业微信-企业Id", position = 1)
        private String corpId;

        @ApiModelProperty(value = "企业微信-自建应用Id", position = 2)
        private String agentId;

        @ApiModelProperty(value = "企业微信-是否启用", position = 3)
        private Boolean enabled;

    }

}
