package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Shawn Deng
 * @date 2020-12-03 00:01:08
 */
@Setter
@Getter
@ToString
public class FeishuAdminUserListResponse extends BaseResponse {

    private FeishuAdminUserList data;
}
