package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * <p>
 * 企业微信创建临时授权配置结果视图
 * </p>
 *
 * @author Pengap
 * @date 2021/8/2 17:02:38
 */
@Data
@Accessors(chain = true)
@ApiModel("企业微信创建临时授权配置结果视图")
public class WeComCreateTempConfigResult {

    @ApiModelProperty(value = "配置文件sha", position = 1)
    private String configSha;

    @ApiModelProperty(value = "企业微信专属域名", example = "spcxqmlr2lusd.enp.vika.ltd", position = 2)
    private String domainName;

}
