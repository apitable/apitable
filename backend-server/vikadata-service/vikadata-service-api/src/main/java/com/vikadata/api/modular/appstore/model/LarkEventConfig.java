package com.vikadata.api.modular.appstore.model;

import lombok.Data;

/**
 * 飞书事件配置
 * @author Shawn Deng
 * @date 2022-01-14 18:41:43
 */
@Data
public class LarkEventConfig {

    /**
     * 事件加密密钥
     */
    private String encryptKey;

    /**
     * 事件验证令牌
     */
    private String verificationToken;
}
