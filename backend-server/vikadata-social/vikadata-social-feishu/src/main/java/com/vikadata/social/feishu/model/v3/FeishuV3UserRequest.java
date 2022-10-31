package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * Get single user information Query parameters
 */
@Getter
@Setter
public class FeishuV3UserRequest {

    private String userIdType;

    private String departmentIdType;
}
