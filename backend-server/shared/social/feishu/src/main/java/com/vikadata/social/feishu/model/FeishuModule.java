package com.vikadata.social.feishu.model;

import com.fasterxml.jackson.databind.module.SimpleModule;

/**
 * hybrid structure
 *
 * @author Shawn Deng
 * @date 2020-11-21 09:41:22
 */
public class FeishuModule extends SimpleModule {

    private static final long serialVersionUID = 1L;

    public FeishuModule() {
        super("FeishuModule");
    }

    @Override
    public void setupModule(SetupContext context) {

    }
}
