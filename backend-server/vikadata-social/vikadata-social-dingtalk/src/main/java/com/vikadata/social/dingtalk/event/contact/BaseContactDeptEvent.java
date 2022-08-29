package com.vikadata.social.dingtalk.event.contact;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * <p>
 * 基础通讯录部门事件属性
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 4:11 下午
 */
@Setter
@Getter
public class BaseContactDeptEvent extends BaseEvent {
    @JsonProperty(value = "CorpId")
    private String corpId;

    @JsonProperty(value = "TimeStamp")
    private String timestamp;

    @JsonProperty(value = "DeptId")
    private List<String> deptId;
}
