package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.BotOperations;

/**
 * 机器人接口
 *
 * @author Shawn Deng
 * @date 2020-11-19 12:14:28
 */
public class BotTemplate extends AbstractFeishuOperations implements BotOperations {

    public BotTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }
}
