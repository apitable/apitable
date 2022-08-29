package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 用户信息 v2接口参数
 * </p> 
 * @author zoe zheng 
 * @date 2021/5/7 4:09 下午
 */
@Setter
@Getter
@ToString
public class DingTalkUserInfoV2Request {

    private String code;
}
