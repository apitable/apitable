package com.vikadata.social.service.dingtalk.model.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * dingtalk callback message body
 */
@Data
@ApiModel(value = "dingding callback encrypted message body")
public class DingTalkCallbackRo {
    @ApiModelProperty(value = "encrypt string", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP+rXpPbcLGOmIxxxx", required = true)
    private String encrypt;
}
