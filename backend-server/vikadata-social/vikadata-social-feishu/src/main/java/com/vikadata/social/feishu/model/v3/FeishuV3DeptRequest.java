package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * Get individual user information query parameters
 */
@Getter
@Setter
public class FeishuV3DeptRequest {

    private String userIdType;

    private String departmentIdType;
}
