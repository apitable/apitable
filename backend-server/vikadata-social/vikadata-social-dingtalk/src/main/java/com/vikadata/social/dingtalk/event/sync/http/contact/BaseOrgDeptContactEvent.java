package com.vikadata.social.dingtalk.event.sync.http.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.event.sync.http.BaseBizDataEvent;

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
