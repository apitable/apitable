package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * Get individual user information,
 * query parameters
 */
@Getter
@Setter
public class FeishuV3UsersRequest {

    private String userIdType;

    private String departmentIdType;

    private String departmentId;

    private Integer pageSize = 50;

    private String pageToken;

}
