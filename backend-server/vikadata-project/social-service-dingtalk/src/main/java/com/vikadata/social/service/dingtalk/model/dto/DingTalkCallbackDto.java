package com.vikadata.social.service.dingtalk.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * vika api 钉钉回调返回的数据
 *
 * @author Zoe Zheng
 * @date 2021-08-31 16:35:09
 */
@Data
@ApiModel(value = "vika api 返回的数据")
public class DingTalkCallbackDto {
    @ApiModelProperty(value = "消息签名", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP+rXpPbcLGOmIxxxx", required = true)
    @JsonProperty(value = "msg_signature")
    private String msgSignature;

    @ApiModelProperty(value = "随机字符串", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP", required = true)
    private String nonce;

    @ApiModelProperty(value = "时间戳", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP", required = true)
    private String timeStamp;

    @ApiModelProperty(value = "密字符串", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP+rXpPbcLGOmIxxxx", required = true)
    private String encrypt;
}
