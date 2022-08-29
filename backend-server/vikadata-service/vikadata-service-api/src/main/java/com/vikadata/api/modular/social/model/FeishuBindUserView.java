package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * 绑定用户视图
 *
 * @author Shawn Deng
 * @date 2020-12-09 16:01:42
 */
@Data
public class FeishuBindUserView {

    private Long id;

    private String openId;

    private Long userId;
}
