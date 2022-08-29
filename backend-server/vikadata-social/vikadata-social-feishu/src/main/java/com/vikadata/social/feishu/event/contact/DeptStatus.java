package com.vikadata.social.feishu.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 部门状态
 * 新版通讯录事件
 *
 * @author Shawn Deng
 * @date 2020-12-24 12:08:15
 */
@Setter
@Getter
public class DeptStatus {

    @JsonProperty("is_deleted")
    private boolean isDeleted;
}
