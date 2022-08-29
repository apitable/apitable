package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** 
* <p> 
* 获取指定部门的所有父部门列表
* </p> 
* @author zoe zheng 
* @date 2021/5/12 7:19 下午
*/
@Getter
@Setter
@ToString
public class DingTalkDeptListParentByDeptRequest {

    /**
     * 要查询的部门的ID。
     */
    private Long deptId;
}
