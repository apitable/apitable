package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get the authorization scope of the address book
 */
@Getter
@Setter
@ToString
public class FeishuContactScopeResponse extends BaseResponse {

    private FeishuContactScope data;
}
