package com.vikadata.social.feishu.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Shawn Deng
 * @date 2020-12-03 00:04:46
 */
@Setter
@Getter
@ToString
public class FeishuAdminUserList {

    private List<Admin> userList = new ArrayList<>();

    @Setter
    @Getter
    @ToString
    public static class Admin {

        private String openId;

        private String unionId;

        private String userId;
    }
}
