package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get user id using unified id
 */
@Getter
@Setter
@ToString
public class FeishuGetUserByUnionIdRequest {

    private List<String> unionIds;
}
