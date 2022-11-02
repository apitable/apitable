package com.vikadata.api.model.vo.social;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企业微信配置文件校验结果视图
 * </p>
 *
 * @author Pengap
 * @date 2021/8/1 15:57:39
 */
@Data
@ApiModel("企业微信配置文件校验结果视图")
public class WeComCheckConfigVo {

    @ApiModelProperty(value = "配置文件是否校验通过", position = 1)
    private Boolean isPass;

    @ApiModelProperty(value = "配置文件校验通过后生成的Sha", position = 2)
    private String configSha;

    @ApiModelProperty(value = "企业微信专属域名", example = "spcxqmlr2lusd.enp.vika.ltd", position = 3)
    private String domainName;

}
