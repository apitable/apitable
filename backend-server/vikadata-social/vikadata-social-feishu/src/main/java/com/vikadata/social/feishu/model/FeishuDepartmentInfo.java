package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 部门信息
 * @author Shawn Deng
 * @date 2020-11-18 16:44:19
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
