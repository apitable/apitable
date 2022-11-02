package com.vikadata.api.model.vo.social;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.DesensitizedSecretSerializer;

/**
 * <p>
 * 企业微信已绑定配置文件视图
 * </p>
 *
 * @author Pengap
 * @date 2021/8/1 15:57:39
 */
@Data
@ApiModel("企业微信已绑定配置文件视图")
public class WeComBindConfigVo {

    @ApiModelProperty(value = "企业Id", position = 1)
    private String corpId;

    @ApiModelProperty(value = "自建应用Id", position = 2)
    private Integer agentId;

    @ApiModelProperty(value = "自建应用密钥", position = 3)
    @JsonSerialize(using = DesensitizedSecretSerializer.class)
    private String agentSecret;

    @ApiModelProperty(value = "自建应用状态（0：启用，1：停用）", position = 4)
    private Integer agentStatu;

    @ApiModelProperty(value = "企业专属域名", example = "spcxqmlr2lusd.enp.vika.ltd", position = 5)
    private String domainName;

}
