package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * 新版事件用户组数据结构
 *
 * @author Shawn Deng
 * @date 2020-12-22 14:46:11
 */
@Setter
@Getter
public class FeishuUserGroupObject {

    private String userGroupId;

    private String name;
}
