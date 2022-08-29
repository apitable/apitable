package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 部门详情
 *
 * @author Shawn Deng
 * @date 2020-12-09 11:02:48
 */
@Setter
@Getter
@ToString
public class FeishuDepartmentDetail extends FeishuDepartmentInfo {

    private String leaderEmployeeId;

    private String leaderOpenId;

    private String chatId;

    private int memberCount;

    private int status;
}
