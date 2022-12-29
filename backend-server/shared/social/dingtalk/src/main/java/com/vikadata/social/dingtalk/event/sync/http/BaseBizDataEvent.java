package com.vikadata.social.dingtalk.event.sync.http;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class BaseBizDataEvent extends BaseSyncHttpEvent {
    private Integer errcode;

    private String errmsg;
}
