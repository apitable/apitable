package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * Get parent department information Query parameters
 */
@Getter
@Setter
public class FeishuV3GetParentDeptsRequest {

    private String userIdType;

    private String departmentIdType;

    private String departmentId;

    private Integer pageSize = 10;

    private String pageToken;

}
