package com.vikadata.social.dingtalk.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * sync http push event public properties
 */
@Getter
@Setter
@ToString
public class BaseSyncHttpBizData {
    private Long gmtCreate;

    private Integer bizType;

    private Integer openCursor;

    private String subscribeId;

    private Integer id;

    private Long gmtModified;

    private String bizId;

    private String corpId;

    private Integer status;

    private String bizData;
}
