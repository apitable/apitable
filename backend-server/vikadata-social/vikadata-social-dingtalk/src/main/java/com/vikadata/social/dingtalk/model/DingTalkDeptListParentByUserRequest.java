package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** 
* <p> 
* 获取指定用户的所有父部门列表
* </p> 
* @author zoe zheng 
* @date 2021/5/12 7:19 下午
*/
@Getter
@Setter
@ToString
public class DingTalkDeptListParentByUserRequest {

    /**
     * 要查询的用户的userid。
     */
    private String userid;
}
