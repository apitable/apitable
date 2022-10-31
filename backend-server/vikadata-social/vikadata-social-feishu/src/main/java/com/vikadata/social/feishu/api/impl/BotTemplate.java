package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.BotOperations;

/**
 * Robot interface
 */
public class BotTemplate extends AbstractFeishuOperations implements BotOperations {

    public BotTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }
}
