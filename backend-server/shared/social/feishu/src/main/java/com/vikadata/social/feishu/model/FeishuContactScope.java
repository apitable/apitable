package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * @author Shawn Deng
 * @date 2020-12-09 01:02:37
 */
@Getter
@Setter
@ToString
public class FeishuContactScope {

    private List<String> authedDepartments;

    private List<String> authedOpenDepartments;

    private List<String> authedEmployeeIds;

    private List<String> authedOpenIds;
}
