package com.vikadata.social.service.dingtalk.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * vika api data returned by dingtalk callback
 */
@Data
@ApiModel(value = "vika api data returned")
public class DingTalkCallbackDto {
    @ApiModelProperty(value = "msgSignature", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP+rXpPbcLGOmIxxxx", required = true)
    @JsonProperty(value = "msg_signature")
    private String msgSignature;

    @ApiModelProperty(value = "nonce", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP", required = true)
    private String nonce;

    @ApiModelProperty(value = "timeStamp", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP", required = true)
    private String timeStamp;

    @ApiModelProperty(value = "encrypt", dataType = "java.lang.String", example = "1ojQf0NSvw2WPvW7LijxS8UvISr8pdDP+rXpPbcLGOmIxxxx", required = true)
    private String encrypt;
}
