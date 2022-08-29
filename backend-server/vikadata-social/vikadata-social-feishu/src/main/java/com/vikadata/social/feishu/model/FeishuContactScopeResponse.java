package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取通讯录授权范围
 *
 * @author Shawn Deng
 * @date 2020-12-01 11:52:45
 */
@Getter
@Setter
@ToString
public class FeishuContactScopeResponse extends BaseResponse {

    private FeishuContactScope data;
}
