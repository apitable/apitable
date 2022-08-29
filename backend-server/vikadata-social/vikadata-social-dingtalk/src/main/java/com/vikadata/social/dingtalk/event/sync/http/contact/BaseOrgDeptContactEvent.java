package com.vikadata.social.dingtalk.event.sync.http.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.event.sync.http.BaseBizDataEvent;

/**
 * <p> 
 * 事件列表 -- 企业员工的最新状态
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/2 3:47 下午
 */
@Setter
@Getter
@ToString
public class BaseOrgDeptContactEvent extends BaseBizDataEvent {
    @JsonProperty("userPerimits")
    private String userPerimits;

    @JsonProperty("orgDeptOwner")
    private String orgDeptOwner;

    @JsonProperty("outerDept")
    private Boolean outerDept;

    private String errmsg;

    @JsonProperty("deptManagerUseridList")
    private String deptManagerUseridList;

    private Long parentid;

    @JsonProperty("groupContainSubDept")
    private Boolean groupContainSubDept;

    @JsonProperty("outerPermitUsers")
    private String outerPermitUsers;

    @JsonProperty("outerPermitDepts")
    private String outerPermitDepts;

    @JsonProperty("deptPerimits")
    private String deptPerimits;

    @JsonProperty("createDeptGroup")
    private Boolean createDeptGroup;

    private String name;

    private Long id;

    @JsonProperty("autoAddUser")
    private Boolean autoAddUser;

    @JsonProperty("deptHiding")
    private Boolean deptHiding;

    private Long order;
}
