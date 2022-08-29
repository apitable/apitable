package com.vikadata.api.modular.client.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 应用版本信息
 * @author Shawn Deng
 * @date 2022-05-23 15:11:41
 */
@Data
@ApiModel("应用版本信息")
public class ClientInfoVO {

    @Deprecated
    @ApiModelProperty(value = "应用环境", example = "production", position = 1, hidden = true, notes = "这个参数交给前端web_server维护")
    private String env;

    @Deprecated
    @ApiModelProperty(value = "应用版本", example = "v0.12.1-release.3", position = 2, hidden = true, notes = "这个参数交给前端web_server维护")
    private String version;

    @ApiModelProperty(value = "用户全局设置的客户端语言", example = "zh-CN", position = 3)
    private String locale;

    @ApiModelProperty(value = "网页头部信息(根据客户语言设置返回头部的渲染信息)", position = 4)
    private String metaContent;

    @ApiModelProperty(value = "用户信息", position = 5)
    private String userInfo;

    @ApiModelProperty(value = "新手引导信息", position = 6)
    private String wizards;

    @ApiModelProperty(value = "访问['/', '/workbench']，重定向。有就重定向，无就不理会", position = 7)
    private String redirect;

    @ApiModelProperty(value = "空间站灰度环境，可以为空", position = 8)
    private String spaceGrayEnv;
}
