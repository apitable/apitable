package com.vikadata.social.dingtalk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 创建apaas应用
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/29 10:45
 */
@Setter
@Getter
@ToString
public class DingTalkCreateApaasAppResponse extends BaseResponse {

    @JsonProperty("agentId")
    private String agentId;

    @JsonProperty("bizAppId")
    private String bizAppId;
}
