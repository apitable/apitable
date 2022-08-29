package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** 
* <p> 
* 异步发送工作通知
* </p> 
* @author zoe zheng 
* @date 2021/5/14 3:20 下午
*/
@Setter
@Getter
@ToString
public class DingTalkAsyncSendCorpMessageRequest {

    private Long agentId;

    private String useridList;

    private Boolean toAllUser;

    private Object msg;
}
