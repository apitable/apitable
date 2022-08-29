package com.vikadata.social.service.dingtalk.model.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 钉钉回调消息体
 *
 * @author Zoe Zheng
 * @date 2021-08-31 16:35:09
 */
@Data
@ApiModel(value = "钉钉回调加密消息体")
public class DingTalkCallbackRo  {
    @ApiModelProperty(value = "密字符串", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP+rXpPbcLGOmIxxxx", required = true)
    private String encrypt;
}
