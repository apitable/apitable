package com.vikadata.api.modular.appstore.model;

import lombok.Data;

/**
 * Lark event configuration
 */
@Data
public class LarkEventConfig {

    /**
     * Event Encryption Key
     */
    private String encryptKey;

    /**
     * Event validation token
     */
    private String verificationToken;
}
