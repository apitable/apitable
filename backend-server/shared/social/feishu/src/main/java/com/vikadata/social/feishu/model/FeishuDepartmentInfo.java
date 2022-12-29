package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Department Information
 */
@Setter
@Getter
@ToString
public class FeishuDepartmentInfo {

    private String id;

    private String name;

    private String parentId;

    private String openDepartmentId;

    private String parentOpenDepartmentId;
}
