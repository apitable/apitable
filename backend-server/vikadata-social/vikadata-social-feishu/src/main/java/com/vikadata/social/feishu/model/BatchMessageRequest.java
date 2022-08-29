package com.vikadata.social.feishu.model;

import com.vikadata.social.feishu.event.UserInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 批量发送消息请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-03 00:13:07
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
        } else {
            userIds = cache;
        }
    }

}
