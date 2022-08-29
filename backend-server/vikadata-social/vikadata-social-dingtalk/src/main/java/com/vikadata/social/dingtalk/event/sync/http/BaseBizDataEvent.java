package com.vikadata.social.dingtalk.event.sync.http;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 事件列表 -- 企业员工的最新状态
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/2 3:47 下午
 */
@Setter
@Getter
@ToString
public class BaseBizDataEvent extends BaseSyncHttpEvent {
    private Integer errcode;

    private String errmsg;
}
