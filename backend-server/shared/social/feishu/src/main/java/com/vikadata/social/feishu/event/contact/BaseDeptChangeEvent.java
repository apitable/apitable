package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.event.BaseEvent;

@Setter
@Getter
@ToString
public class BaseDeptChangeEvent extends BaseEvent {

    private String openDepartmentId;
}
