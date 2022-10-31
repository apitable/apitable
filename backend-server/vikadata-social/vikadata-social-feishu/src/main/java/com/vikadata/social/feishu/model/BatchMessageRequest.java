package com.vikadata.social.feishu.model;

import java.util.List;
import java.util.stream.Collectors;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.feishu.event.UserInfo;

/**
 * batch send message request parameters
 */
@Getter
@Setter
public class BatchMessageRequest {

    private List<String> departmentIds;

    private List<String> openIds;

    private List<String> userIds;

    public void setUsers(List<UserInfo> users) {
        List<String> cache = users.stream().map(UserInfo::getUserId).collect(Collectors.toList());
        if (userIds != null) {
            userIds.addAll(cache);
        }
        else {
            userIds = cache;
        }
    }

}
